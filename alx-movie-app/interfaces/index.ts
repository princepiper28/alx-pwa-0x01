// types/movieTypes.ts
import { ReactNode } from "react"

export interface ComponentProps {
  children: ReactNode
}

export interface ButtonProps {
  title: string
  action?: () => void
}

// UI-friendly type for rendering
export interface MovieProps {
  id: string
  posterImage: string
  title: string
  releaseYear: string
}

// API response type (from IMDb or similar)
export interface MoviesProps {
  id: string
  primaryImage?: { url: string }
  titleText?: { text: string }
  releaseYear?: { year: number | string }
}

// Helper function to map API data → UI-friendly data
export const mapMovies = (movies: MoviesProps[]): MovieProps[] => {
  return movies.map((movie) => ({
    id: movie.id,
    posterImage: movie.primaryImage?.url ?? "/placeholder.png",
    title: movie.titleText?.text ?? "Untitled",
    releaseYear: movie.releaseYear?.year?.toString() ?? "N/A",
  }))
}