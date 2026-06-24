export interface Movie {
  _id: string
  name: string
  origin_name: string
  slug: string
  type: 'series' | 'single'
  thumb_url: string
  poster_url: string
  year: number
  quality: string
  lang: string
  episode_current: string
  episode_total: string
  time: string
  status: string
  sub_docquyen: boolean
  chieurap: boolean
  category: Category[]
  country: Country[]
  actor?: string[]
  director?: string[]
  content?: string
  tmdb?: {
    id: string
    type: string
    vote_average: number
    vote_count: number
  }
  modified: {
    time: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Country {
  id: string
  name: string
  slug: string
}

export interface Episode {
  server_name: string
  server_data: EpisodeItem[]
}

export interface EpisodeItem {
  name: string
  slug: string
  filename: string
  link_embed: string
  link_m3u8: string
}

export interface MovieListResponse {
  status: boolean
  msg: string
  data: {
    items: Movie[]
    params: {
      pagination: {
        totalItems: number
        totalItemsPerPage: number
        currentPage: number
        totalPages: number
      }
    }
  }
}

export interface MovieDetailResponse {
  status: boolean
  msg: string
  movie: Movie & {
    content: string
    actor: string[]
    director: string[]
  }
  episodes: Episode[]
}

export interface SearchResponse {
  status: boolean
  msg: string
  data: {
    items: Movie[]
    params: {
      pagination: {
        totalItems: number
        totalItemsPerPage: number
        currentPage: number
        totalPages: number
      }
    }
  }
}
