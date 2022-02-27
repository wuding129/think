import { container } from "@services/index";

export function useService<T>(type) {
  return container.get<T>(type) as T;
}
