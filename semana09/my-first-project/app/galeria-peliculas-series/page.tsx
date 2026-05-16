import SearchMovies from "../components/SearchMovies";

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;


async function getPopularMovies() {
    const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=marvel`,
        {
            cache: "no-store",
        }
    );

    return response.json();
}

export default async function Page() {
    const data = await getPopularMovies();

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">

            {/* HERO */}
            <section className="relative h-[450px] flex items-center justify-center overflow-hidden">

                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
                        alt="Cinema"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>

                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-red-500 to-yellow-400 text-transparent bg-clip-text">
                        Movie Universe
                    </h1>

                    <p className="text-gray-300 text-lg md:text-2xl max-w-2xl mx-auto">
                        Explora películas y series con información en tiempo real usando OMDb API y Next.js
                    </p>
                </div>
            </section>

            {/* SEARCH */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <SearchMovies />
            </section>

            {/* POPULARES */}
            <section className="max-w-7xl mx-auto px-6 pb-20">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">
                        Populares
                    </h2>

                    <span className="text-gray-400">
                        Marvel Collection
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {data.Search?.map((movie: any) => (
                        <div
                            key={movie.imdbID}
                            className="group relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition duration-300"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={
                                        movie.Poster !== "N/A"
                                            ? movie.Poster
                                            : "https://via.placeholder.com/300x450?text=No+Image"
                                    }
                                    alt={movie.Title}
                                    className="w-full h-[500px] object-cover group-hover:scale-110 transition duration-500"
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                            <div className="absolute bottom-0 p-6">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                                    {movie.Type}
                                </span>

                                <h3 className="text-2xl font-bold mt-3">
                                    {movie.Title}
                                </h3>

                                <p className="text-gray-300">
                                    {movie.Year}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}