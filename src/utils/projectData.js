export const isPublicProject = (project) => Boolean(project?.name && project?.slug);

const timestampToMillis = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  if (typeof value === 'number') return value;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const getProjectFreshness = (project = {}) => Math.max(
  timestampToMillis(project.updatedAt),
  timestampToMillis(project.createdAt),
);

export const compareProjectsByFreshness = (a = {}, b = {}) => {
  const freshnessDiff = getProjectFreshness(b) - getProjectFreshness(a);
  if (freshnessDiff !== 0) return freshnessDiff;
  return String(b.id || '').localeCompare(String(a.id || ''));
};

export const selectLatestProject = (projects = []) => {
  const publicProjects = projects.filter(isPublicProject);
  if (!publicProjects.length) return null;
  return [...publicProjects].sort(compareProjectsByFreshness)[0];
};

export const normalizePublicProjects = (projects = []) => {
  const bySlug = new Map();

  projects.filter(isPublicProject).forEach((project) => {
    const key = project.slug;
    const current = bySlug.get(key);
    if (!current || compareProjectsByFreshness(project, current) < 0) {
      bySlug.set(key, project);
    }
  });

  return [...bySlug.values()].sort((a, b) => {
    const orderDiff = Number(a.order || 0) - Number(b.order || 0);
    if (orderDiff !== 0) return orderDiff;
    return compareProjectsByFreshness(a, b);
  });
};
