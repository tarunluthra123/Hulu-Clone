import React from "react";
import axios from "axios";
import {
    find,
    BASE_URL,
    BASE_IMAGE_URL,
    credits,
    recommendations,
    trailer,
} from "../../utils/requests";
import PersonThumbnail from "../../components/PersonThumbnail";
import SuggestionThumbnail from "../../components/SuggestionThumbnail";
import Header from "../../components/Header";
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { PlayIcon } from "@heroicons/react/solid";

const Details = ({ details, cast, suggestions, trailer }) => {
    // Dummy user. Will be replaced later by actual user details that is fetched from redux
    const user = { name: "Tarun" };

    console.log(details);

    return (
        <div>
            <Header />

            <div
                className="h-60 p-5 bg-cover flex items-end bg-center group md:px-16 lg:px-20 background_poster relative lg:bg-top lg:h-half lg:items-center xl:px-48 2xl:px-72 3xl:px-96"
                style={{
                    backgroundImage: `url(${BASE_IMAGE_URL}${details.backdrop_path})`,
                }}
            >
                <div className="z-10 text-white">
                    <h1 className="font-bold text-4xl text-white group-hover:text-5xl duration-200 cursor-pointer transition-all lg:text-5xl">
                        {details.name}
                    </h1>
                    <div className="lg:block hidden pr-10">
                        <div className="text-white font-bold text-md pb-1">
                            <span>{details.first_air_date.slice(0, 4)} • </span>
                            <span>
                                {details.genres
                                    .map((genre) => genre.name)
                                    .join(", ")}{" "}
                                •{" "}
                            </span>
                            <span>{details.episode_run_time} mins</span>
                        </div>

                        <div className="flex">
                            <div className="flex items-center w-1/4 justify-around">
                                <div className="w-16 m-2">
                                    <CircularProgressbarWithChildren
                                        value={details.vote_average}
                                        maxValue={10}
                                        styles={buildStyles({
                                            pathColor: "rgb(31, 180, 31)",
                                            trailColor: "#0e4257",
                                        })}
                                    >
                                        <strong>{details.vote_average}</strong>
                                    </CircularProgressbarWithChildren>
                                </div>
                                <strong>User Score</strong>
                            </div>

                            <a
                                className="flex items-center cursor-pointer mx-2 justify-around w-32 text-white hover:text-gray-300 duration-100"
                                href={trailer}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <PlayIcon className="w-10" />
                                <p>Play Trailer</p>
                            </a>
                        </div>

                        <div className="text-gray-400 italic text-lg pb-1">
                            {details.tagline}
                        </div>

                        <p className="text-base">{details.overview}</p>

                        <div className="pt-3 text-lg">
                            Created By:{" "}
                            <strong>
                                {details.created_by
                                    .map((creator) => creator.name)
                                    .join(", ")}
                            </strong>
                        </div>
                    </div>
                </div>
                <img
                    src={BASE_IMAGE_URL + details.poster_path}
                    alt={details.name}
                    className="w-1/2 z-20 h-full hidden lg:block"
                />
            </div>

            <div className="p-5 md:px-16 lg:hidden">
                <div className="text-white font-bold text-md pb-1">
                    <span>{details.first_air_date.slice(0, 4)} • </span>
                    <span>
                        {details.genres.map((genre) => genre.name).join(", ")} •{" "}
                    </span>
                    <span>{details.episode_run_time} mins</span>
                </div>

                <div className="flex">
                    <div className="flex items-center w-1/4 justify-around">
                        <div className="w-16 m-2">
                            <CircularProgressbarWithChildren
                                value={details.vote_average}
                                maxValue={10}
                                styles={buildStyles({
                                    pathColor: "rgb(31, 180, 31)",
                                    trailColor: "#0e4257",
                                })}
                            >
                                <strong>{details.vote_average}</strong>
                            </CircularProgressbarWithChildren>
                        </div>
                        <strong>User Score</strong>
                    </div>

                    <a
                        className="flex items-center cursor-pointer mx-2 justify-around w-32 text-white hover:text-gray-300 duration-100"
                        href={trailer}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <PlayIcon className="w-10" />
                        <p>Play Trailer</p>
                    </a>
                </div>

                <div className="text-gray-400 italic text-lg pb-1">
                    {details.tagline}
                </div>

                <p className="text-base">{details.overview}</p>

                <div className="pt-3 text-lg">
                    Created By:{" "}
                    <strong>
                        {details.created_by
                            .map((creator) => creator.name)
                            .join(", ")}
                    </strong>
                </div>
            </div>

            <div className="p-5 md:px-16 lg:px-40 xl:px-48 2xl:px-72 3xl:px-96 lg:pt-10">
                <h2 className="text-2xl font-bold text-white mb-2 lg:text-3xl">
                    Top Billed Cast
                </h2>
                <div className="flex flex-wrap w-full justify-center gap-3 lg:justify-between xl:gap-6">
                    {cast.map((person) => (
                        <PersonThumbnail key={person.id} person={person} />
                    ))}
                </div>
            </div>

            <div className="p-5 md:px-16 lg:px-40 xl:px-48 2xl:px-72 3xl:px-96 lg:pt-10">
                <h2 className="text-2xl font-bold text-white mb-2 lg:text-3xl">
                    Recommendations
                </h2>
                <div className="flex flex-wrap w-full justify-center gap-3 lg:justify-between xl:gap-6">
                    {suggestions.map((suggestion) => (
                        <SuggestionThumbnail
                            key={suggestion.id}
                            suggestion={suggestion}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { id } = context.query;
    let url = BASE_URL + find.tv.url(id);
    const details = await axios.get(url).then((res) => res.data);
    url = BASE_URL + credits.tv.url(id);
    const castList = await axios.get(url).then((res) => res.data);
    url = BASE_URL + recommendations.tv.url(id);
    const suggestionsList = await axios.get(url).then((res) => res.data);
    url = BASE_URL + trailer.tv.url(id);
    const videosList = await axios.get(url).then((res) => res.data);

    const cast = castList.cast.map((person) => ({
        character: person.character,
        id: person.id,
        name: person.name,
        original_name: person.original_name,
        profile_path: person.profile_path,
    }));

    const suggestions = suggestionsList.results.slice(0, 12).map((show) => ({
        name: show.name,
        backdrop_path: show.backdrop_path,
        id: show.id,
    }));

    const trailerKey = videosList.results[0].key;
    const trailerLink = `https://www.youtube.com/watch?v=${trailerKey}`;

    return {
        props: {
            details,
            cast,
            suggestions,
            trailer: trailerLink,
        },
    };
}

export default Details;