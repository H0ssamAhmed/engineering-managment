import { ProjectStageAccordion } from '@/components/ProjectStageAccordion'
import { useProjects } from '@/hooks/useProjects';
import React from 'react'
import { useParams } from 'react-router-dom';

const ProjectsDetails = () => {
    const { id } = useParams();

    const { projects, stages, clients, updateStage, createProject } = useProjects();
    const projectsDetails = projects.filter(p => p.id === id)[0]
    console.log(projectsDetails);


    return (
        <div>
            <ProjectStageAccordion
                projectId={projectsDetails.id}
                stages={stages.filter(s => s.project_id === projectsDetails.id)}
                onStageUpdate={(stageId, updates) => updateStage(projectsDetails.id, stageId, updates, "CURRENT_USER_ID")}
            />
        </div>
    )
}

export default ProjectsDetails