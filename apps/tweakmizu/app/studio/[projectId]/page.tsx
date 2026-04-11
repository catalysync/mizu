import { ProjectView } from './project-view';

export const metadata = {
  title: 'Studio project — tweakmizu',
};

export default async function StudioProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ProjectView projectId={projectId} />;
}
