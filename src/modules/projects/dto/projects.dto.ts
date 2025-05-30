import { Project } from '../entities/project.entity';

export class ProjectDto {
  id: string;
  name: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  logo_image?: string;

  constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description ?? "";
    this.start_date = project.start_date ?? "";
    this.end_date = project.end_date ?? "";
    this.logo_image = project.logo_image ?? "";
  }
}
