import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

// Mock TypeORM repository
const mockProjectRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const mockProjects = [{ id: 1, name: 'Project 1', status: 'active' }];
      mockProjectRepository.find.mockReturnValue(mockProjects);

      const result = await service.findAll();
      expect(result).toEqual(mockProjects);
      expect(mockProjectRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create and return a project', async () => {
      const createDto: CreateProjectDto = { name: 'New Project', status: 'planned' };
      const createdProject = { id: 2, ...createDto };

      mockProjectRepository.create.mockReturnValue(createDto);
      mockProjectRepository.save.mockResolvedValue(createdProject);

      const result = await service.create(createDto);
      expect(result).toEqual(createdProject);
      expect(mockProjectRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockProjectRepository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findOne', () => {
    it('should return a project if found', async () => {
      const id = 1;
      const mockProject = { id, name: 'Found Project', status: 'active' };
      mockProjectRepository.findOneBy.mockResolvedValue(mockProject);

      const result = await service.findOne(id);
      expect(result).toEqual(mockProject);
      expect(mockProjectRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if project is not found', async () => {
      const id = 99;
      mockProjectRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a project', async () => {
      const id = 1;
      const updateDto: UpdateProjectDto = { name: 'Updated Name' };
      const existingProject = { id, name: 'Old Name', status: 'active' };
      const updatedProject = { ...existingProject, ...updateDto };

      mockProjectRepository.preload.mockResolvedValue(updatedProject);
      mockProjectRepository.save.mockResolvedValue(updatedProject);

      const result = await service.update(id, updateDto);
      expect(result).toEqual(updatedProject);
      expect(mockProjectRepository.preload).toHaveBeenCalledWith({ id, ...updateDto });
      expect(mockProjectRepository.save).toHaveBeenCalledWith(updatedProject);
    });

    it('should throw NotFoundException if project to update is not found', async () => {
      const id = 99;
      const updateDto: UpdateProjectDto = { name: 'Non-existent' };
      mockProjectRepository.preload.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a project successfully', async () => {
      const id = 1;
      mockProjectRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(id);
      expect(mockProjectRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if project to remove is not found', async () => {
      const id = 99;
      mockProjectRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
