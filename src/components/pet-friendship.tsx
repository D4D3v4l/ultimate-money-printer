import { mascots } from "@/lib/mock-data";
import { createContext, use, useCallback, useMemo, useState } from "react";

type PetFriendshipValue = {
  /** Nivel actual por nombre de mascota. */
  levels: Record<string, number>;
  /** Sube un nivel a la mascota indicada. */
  levelUp: (name: string) => void;
};

const PetFriendshipContext = createContext<PetFriendshipValue | null>(null);

/**
 * Estado compartido de la amistad con las mascotas. Vive en el layout para que
 * la sidebar y la vista de misión(`/misiones`) monoxide el mismo nivel.
 */
export function PetFriendshipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [levels, setLevels] = useState<Record<string, number>>(() =>
    Object.fromEntries(mascots.map((mascot) => [mascot.name, mascot.level])),
  );

  const levelUp = useCallback((name: string) => {
    setLevels((current) =>
      name in current ? { ...current, [name]: current[name] + 1 } : current,
    );
  }, []);

  const value = useMemo(() => ({ levels, levelUp }), [levels, levelUp]);

  return (
    <PetFriendshipContext value={value}>{children}</PetFriendshipContext>
  );
}

export function usePetFriendship() {
  const context = use(PetFriendshipContext);

  if (!context) {
    throw new Error(
      "usePetFriendship debe usarse dentro de <PetFriendshipProvider>.",
    );
  }

  return context;
}