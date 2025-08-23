import { MoviesProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { year, page, genre } = req.body;
      const date = new Date();

      const url = `https://moviesdatabase.p.rapidapi.com/titles?year=${
        year || date.getFullYear()
      }&sort=year.decr&limit=12&page=${page || 1}${genre ? `&genre=${genre}` : ""}`;

      const resp = await fetch(url, {
        headers: {
          "x-rapidapi-host": "moviesdatabase.p.rapidapi.com",
          "x-rapidapi-key": process.env.MOVIE_API_KEY || "",
        },
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Failed to fetch movies: ${resp.status} ${text}`);
      }

      const moviesResponse = await resp.json();
      const movies: MoviesProps[] = moviesResponse.results || [];

      return res.status(200).json({ movies });
    } catch (error: unknown) {
      console.error("API error:", error);

      const message =
        error instanceof Error ? error.message : "An unknown error occurred";

      return res.status(500).json({ error: message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

