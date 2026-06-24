const BASE_URL = 'https://phimapi.com'

export async function getNewMovies(page = 1) {
  const res = await fetch(
    `${BASE_URL}/danh-sach/phim-moi-cap-nhat-v2?page=${page}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Không thể tải danh sách phim')
  return res.json()
}

export async function getMovieDetail(slug: string) {
  const res = await fetch(
    `${BASE_URL}/phim/${slug}`,
    { next: { revalidate: 1800 } }
  )
  if (!res.ok) throw new Error('Không thể tải thông tin phim')
  return res.json()
}

export async function getMovieList(params: {
  type: string
  page?: number
  category?: string
  country?: string
  year?: string
  sort_field?: string
  sort_type?: string
  sort_lang?: string
  limit?: number
}) {
  const { type, page = 1, category, country, year, sort_field = 'modified.time', sort_type = 'desc', sort_lang, limit = 24 } = params
  
  const query = new URLSearchParams({
    page: String(page),
    sort_field,
    sort_type,
    limit: String(limit),
    ...(category && { category }),
    ...(country && { country }),
    ...(year && { year }),
    ...(sort_lang && { sort_lang }),
  })

  const res = await fetch(
    `${BASE_URL}/v1/api/danh-sach/${type}?${query}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Không thể tải danh sách phim')
  return res.json()
}

export async function searchMovies(params: {
  keyword: string
  page?: number
  category?: string
  country?: string
  year?: string
  limit?: number
}) {
  const { keyword, page = 1, category, country, year, limit = 24 } = params

  const query = new URLSearchParams({
    keyword,
    page: String(page),
    limit: String(limit),
    ...(category && { category }),
    ...(country && { country }),
    ...(year && { year }),
  })

  const res = await fetch(
    `${BASE_URL}/v1/api/tim-kiem?${query}`,
    { next: { revalidate: 300 } }
  )
  if (!res.ok) throw new Error('Lỗi tìm kiếm')
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/the-loai`, { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error('Không thể tải thể loại')
  return res.json()
}

export async function getCountries() {
  const res = await fetch(`${BASE_URL}/quoc-gia`, { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error('Không thể tải quốc gia')
  return res.json()
}

export async function getMoviesByCategory(slug: string, page = 1) {
  const res = await fetch(
    `${BASE_URL}/v1/api/the-loai/${slug}?page=${page}&sort_field=modified.time&sort_type=desc&limit=24`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Không thể tải phim theo thể loại')
  return res.json()
}

export async function getMoviesByCountry(slug: string, page = 1) {
  const res = await fetch(
    `${BASE_URL}/v1/api/quoc-gia/${slug}?page=${page}&sort_field=modified.time&sort_type=desc&limit=24`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Không thể tải phim theo quốc gia')
  return res.json()
}
