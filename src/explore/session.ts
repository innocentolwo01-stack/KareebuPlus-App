import type { ExploreEntity } from './content';

let selectedEntity: ExploreEntity | undefined;
const savedIds = new Set<string>();

export const exploreSession = {
  select: (entity: ExploreEntity) => { selectedEntity = entity; },
  selected: () => selectedEntity,
  isSaved: (id: string) => savedIds.has(id),
  toggleSaved: (id: string) => {
    if (savedIds.has(id)) savedIds.delete(id);
    else savedIds.add(id);
    return savedIds.has(id);
  },
};
