import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeProvider";

// De petites réponses API pour tester les interactions sans dépendre du réseau.
const movie = {
  id: 1,
  title: "Inception",
  release_date: "2010-07-16",
  vote_average: 8.8,
  poster_path: null,
  genre_ids: [878],
};

function mockApi() {
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async (input, options) => {
      const url = String(input);
      let data: unknown;
      if (url.includes("/genre/movie/list"))
        data = {
          genres: [
            { id: 878, name: "Science-fiction" },
            { id: 35, name: "Comédie" },
          ],
        };
      else if (url.includes("/movie/1?"))
        data = {
          ...movie,
          tagline: "Un rêve",
          overview: "Une aventure dans les rêves.",
          runtime: 148,
          genres: [{ id: 878, name: "Science-fiction" }],
          credits: {
            cast: [
              {
                id: 10,
                name: "Leonardo DiCaprio",
                character: "Cobb",
                profile_path: null,
              },
            ],
          },
        };
      else if (url.includes("/search/movie"))
        data = { results: url.includes("absent") ? [] : [movie] };
      else if (url.includes("themoviedb")) data = { results: [movie] };
      else if (options?.method === "POST")
        data = {
          id: 201,
          userId: 1,
          title: JSON.parse(String(options.body)).title,
          completed: false,
        };
      else if (options?.method) data = {};
      else
        data = [
          { id: 1, userId: 1, title: "Regarder un film", completed: false },
        ];
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
}

function openApp(path = "/") {
  window.history.replaceState({}, "", path);
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

test("films : likes, recherche, genre et détails avec casting", async () => {
  mockApi();
  const user = userEvent.setup();
  openApp();
  await screen.findByRole("heading", { name: "Inception" });
  await user.click(screen.getByRole("button", { name: "Aimer Inception" }));
  expect(
    screen
      .getByRole("button", { name: "Ne plus aimer Inception" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  await user.type(screen.getByLabelText("Rechercher un film"), "Inception");
  await screen.findByRole("heading", { name: "Inception" });
  await user.selectOptions(screen.getByLabelText("Genre"), "35");
  await screen.findByRole("heading", { name: "Inception" });
  expect(
    (screen.getByLabelText("Rechercher un film") as HTMLInputElement).value,
  ).toBe("");
  await user.selectOptions(screen.getByLabelText("Genre"), "878");
  await screen.findByRole("heading", { name: "Inception" });
  await user.click(screen.getByRole("button", { name: "Réinitialiser" }));
  expect((screen.getByLabelText("Genre") as HTMLSelectElement).value).toBe("");
  await user.click(await screen.findByRole("heading", { name: "Inception" }));
  await screen.findByText("Une aventure dans les rêves.");
  expect(screen.getByText("Leonardo DiCaprio")).toBeTruthy();
});

test("tâches : validation, ajout multiple, modification, filtres et suppression", async () => {
  const api = mockApi();
  vi.spyOn(window, "confirm").mockReturnValue(true);
  const user = userEvent.setup();
  openApp("/todos");
  await screen.findByText("Regarder un film");
  await user.click(screen.getByRole("button", { name: "Ajouter" }));
  expect(screen.getByText(/Le titre doit contenir/)).toBeTruthy();
  await user.type(screen.getByLabelText("Ajouter une tâche"), "Premier film");
  await user.click(screen.getByRole("button", { name: "Ajouter" }));
  await screen.findByText("Premier film");
  await user.type(screen.getByLabelText("Ajouter une tâche"), "Deuxième film");
  await user.click(screen.getByRole("button", { name: "Ajouter" }));
  await screen.findByText("Deuxième film");
  await user.click(
    screen.getByRole("button", { name: "Modifier : Premier film" }),
  );
  await user.clear(screen.getByLabelText("Modifier la tâche"));
  await user.type(screen.getByLabelText("Modifier la tâche"), "Film modifié");
  await user.click(screen.getByRole("button", { name: "Enregistrer" }));
  await screen.findByText("Film modifié");
  await user.click(screen.getByLabelText("Film modifié"));
  await user.click(screen.getByRole("button", { name: /^Terminées/ }));
  expect(screen.queryByText("Deuxième film")).toBeNull();
  await user.click(
    screen.getByRole("button", { name: "Supprimer : Film modifié" }),
  );
  await screen.findByText("Aucune tâche dans cette liste.");
  await user.click(screen.getByRole("button", { name: /^Toutes/ }));
  await user.click(screen.getByLabelText("Regarder un film"));
  await waitFor(() =>
    expect(
      api.mock.calls.some(([, options]) => options?.method === "PATCH"),
    ).toBe(true),
  );
  await user.click(
    screen.getByRole("button", { name: "Supprimer : Regarder un film" }),
  );
  await waitFor(() =>
    expect(screen.queryByText("Regarder un film")).toBeNull(),
  );
  expect(
    api.mock.calls.some(([, options]) => options?.method === "DELETE"),
  ).toBe(true);
});

test("contact : erreurs, soumission simulée et réinitialisation", async () => {
  const user = userEvent.setup();
  openApp("/contact");
  await user.click(screen.getByRole("button", { name: /Envoyer le message/ }));
  expect(screen.getByText("Choisissez un sujet.")).toBeTruthy();
  await user.type(
    screen.getByLabelText("Nom complet", { exact: true }),
    "Sarah",
  );
  await user.type(
    screen.getByLabelText("Email", { exact: true }),
    "sarah@example.com",
  );
  await user.selectOptions(screen.getByLabelText("Sujet"), "feature");
  await user.type(
    screen.getByLabelText("Message", { exact: true }),
    "Une suggestion de film pour ce soir.",
  );
  await user.click(screen.getByLabelText(/J'accepte/));
  await user.click(screen.getByRole("button", { name: /Envoyer le message/ }));
  await screen.findByText(/Message envoyé/, {}, { timeout: 3000 });
  expect(
    (screen.getByLabelText("Nom complet", { exact: true }) as HTMLInputElement)
      .value,
  ).toBe("");
});

test("thème sauvegardé, menu mobile et page 404", async () => {
  const user = userEvent.setup();
  openApp("/page-inconnue");
  expect(screen.getByRole("heading", { name: /404/ })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "☾ Mode sombre" }));
  expect(localStorage.getItem("streamtech-theme")).toBe("dark");
  expect(document.documentElement.getAttribute("data-bs-theme")).toBe("dark");
  await user.click(screen.getByRole("button", { name: "Afficher le menu" }));
  expect(
    screen
      .getByRole("button", { name: "Afficher le menu" })
      .getAttribute("aria-expanded"),
  ).toBe("true");
  await user.click(screen.getByRole("link", { name: "Contact" }));
  expect(screen.getByRole("heading", { name: /Contactez-nous/ })).toBeTruthy();
  expect(
    screen
      .getByRole("button", { name: "Afficher le menu" })
      .getAttribute("aria-expanded"),
  ).toBe("false");
});

test("une erreur API affiche une option pour réessayer", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response("{}", { status: 500 }),
  );
  openApp();
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(
    screen.getAllByRole("button", { name: "Réessayer" }).length,
  ).toBeGreaterThan(0);
});
