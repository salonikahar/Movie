import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import Show from './models/Show.js';
import User from './models/User.js';
import Booking from './models/Booking.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import connectDB from './configs/db.js';

const seedAllData = async () => {
    try {
        await connectDB();
        console.log('Starting data seeding...\n');

        // Sample Movies - Enhanced with more movies
        const sampleMovies = [
            {
                _id: 'movie_001',
                title: 'Avengers: Endgame',
                overview: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance to the universe.',
                poster_path: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
                release_date: '2019-04-26',
                original_language: 'en',
                tagline: 'Part of the journey is the end.',
                genres: [{ name: 'Action' }, { name: 'Adventure' }, { name: 'Drama' }],
                casts: [
                    { name: 'Robert Downey Jr.', profile_path: 'https://image.tmdb.org/t/p/w500/5qHNjhtjMD4YWH3UP0s4Yb9HwHE.jpg' },
                    { name: 'Chris Evans', profile_path: 'https://image.tmdb.org/t/p/w500/3bOGNsHlrswhyW79uvIHH1V43JI.jpg' }
                ],
                crew: [],
                vote_average: 8.4,
                vote_count: 25000,
                runtime: 181,
                isActive: true
            },
            {
                _id: 'movie_002',
                title: 'Spider-Man: No Way Home',
                overview: 'Peter Parker\'s secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man.',
                poster_path: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
                release_date: '2021-12-17',
                original_language: 'en',
                tagline: 'The Multiverse unleashed.',
                genres: [{ name: 'Action' }, { name: 'Adventure' }, { name: 'Fantasy' }],
                casts: [
                    { name: 'Tom Holland', profile_path: 'https://image.tmdb.org/t/p/w500/bBRlrpJm9XkNSg0Y5QQYem8e3oc.jpg' },
                    { name: 'Zendaya', profile_path: 'https://image.tmdb.org/t/p/w500/6TE2al2H6QbsU3UPzLpn6gTInjr.jpg' }
                ],
                crew: [],
                vote_average: 8.3,
                vote_count: 18000,
                runtime: 148,
                isActive: true
            },
            {
                _id: 'movie_003',
                title: 'The Dark Knight',
                overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
                poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UnnHtwU2xvyX3r3.jpg',
                release_date: '2008-07-18',
                original_language: 'en',
                tagline: 'Why So Serious?',
                genres: [{ name: 'Action' }, { name: 'Crime' }, { name: 'Drama' }],
                casts: [
                    { name: 'Christian Bale', profile_path: 'https://image.tmdb.org/t/p/w500/3qx2g1MnyY3lB8k8l0q1T5B1pfp.jpg' },
                    { name: 'Heath Ledger', profile_path: 'https://image.tmdb.org/t/p/w500/5Y3lX42qVqjU68xrYgGXJvqH7T9.jpg' }
                ],
                crew: [],
                vote_average: 9.0,
                vote_count: 30000,
                runtime: 152,
                isActive: true
            },
            {
                _id: 'movie_004',
                title: 'Inception',
                overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.',
                poster_path: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7g7U5b8Z8qvf4Pg.jpg',
                release_date: '2010-07-16',
                original_language: 'en',
                tagline: 'Your mind is the scene of the crime.',
                genres: [{ name: 'Action' }, { name: 'Sci-Fi' }, { name: 'Thriller' }],
                casts: [
                    { name: 'Leonardo DiCaprio', profile_path: 'https://image.tmdb.org/t/p/w500/5Brc5dLHYj2zUO8l3B9RZ0iS2Z5.jpg' },
                    { name: 'Marion Cotillard', profile_path: 'https://image.tmdb.org/t/p/w500/7vFjZ5x9X3J2qJ8q3Y5K8x9Z1H2.jpg' }
                ],
                crew: [],
                vote_average: 8.8,
                vote_count: 35000,
                runtime: 148,
                isActive: true
            },
            {
                _id: 'movie_005',
                title: 'Interstellar',
                overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
                poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/pbrkL804c8yAv3zBZR4QPKEJ20d.jpg',
                release_date: '2014-11-07',
                original_language: 'en',
                tagline: 'Mankind was born on Earth. It was never meant to die here.',
                genres: [{ name: 'Drama' }, { name: 'Sci-Fi' }],
                casts: [
                    { name: 'Matthew McConaughey', profile_path: 'https://image.tmdb.org/t/p/w500/jdRmHrG0bFDPd22lUu7Y1Bw4v3u.jpg' },
                    { name: 'Anne Hathaway', profile_path: 'https://image.tmdb.org/t/p/w500/9prS5gD3lH7Vr8Y5k5Y5Y5Y5Y5Y5.jpg' }
                ],
                crew: [],
                vote_average: 8.6,
                vote_count: 28000,
                runtime: 169,
                isActive: true
            },
            {
                _id: 'movie_006',
                title: 'Dune',
                overview: 'Paul Atreides leads a rebellion to restore his family\'s noble name in a future where humanity has colonized the galaxy.',
                poster_path: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyUYVI6HVa0Knwe65.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg',
                release_date: '2021-10-22',
                original_language: 'en',
                tagline: 'Beyond fear, destiny awaits.',
                genres: [{ name: 'Sci-Fi' }, { name: 'Adventure' }],
                casts: [
                    { name: 'Timothée Chalamet', profile_path: 'https://image.tmdb.org/t/p/w500/A7fT3qQq3n7bmCKC8xX7x7x7x7x7.jpg' },
                    { name: 'Rebecca Ferguson', profile_path: 'https://image.tmdb.org/t/p/w500/lJ2dpxx7x7x7x7x7x7x7x7.jpg' }
                ],
                crew: [],
                vote_average: 8.0,
                vote_count: 15000,
                runtime: 155,
                isActive: true
            },
            {
                _id: 'movie_007',
                title: 'Top Gun: Maverick',
                overview: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, training a new generation of pilots.',
                poster_path: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg',
                release_date: '2022-05-27',
                original_language: 'en',
                tagline: 'Feel the need... The need for speed.',
                genres: [{ name: 'Action' }, { name: 'Drama' }],
                casts: [
                    { name: 'Tom Cruise', profile_path: 'https://image.tmdb.org/t/p/w500/3oWEuo0e8Nx8JvkqYCDec2iMY6K.jpg' },
                    { name: 'Miles Teller', profile_path: 'https://image.tmdb.org/t/p/w500/8x7x7x7x7x7x7x7x7x7x7.jpg' }
                ],
                crew: [],
                vote_average: 8.2,
                vote_count: 12000,
                runtime: 130,
                isActive: true
            },
            {
                _id: 'movie_008',
                title: 'The Matrix',
                overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
                poster_path: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
                release_date: '1999-03-31',
                original_language: 'en',
                tagline: 'Welcome to the Real World.',
                genres: [{ name: 'Action' }, { name: 'Sci-Fi' }],
                casts: [
                    { name: 'Keanu Reeves', profile_path: 'https://image.tmdb.org/t/p/w500/4D0PpRi0knP2ZNAufCWAy4zWz5z.jpg' },
                    { name: 'Laurence Fishburne', profile_path: 'https://image.tmdb.org/t/p/w500/5x7x7x7x7x7x7x7x7x7x7.jpg' }
                ],
                crew: [],
                vote_average: 8.7,
                vote_count: 22000,
                runtime: 136,
                isActive: true
            },
            {
                _id: 'movie_009',
                title: 'Pulp Fiction',
                overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
                poster_path: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
                release_date: '1994-10-14',
                original_language: 'en',
                tagline: 'Just because you are a character doesn\'t mean you have character.',
                genres: [{ name: 'Crime' }, { name: 'Drama' }],
                casts: [
                    { name: 'John Travolta', profile_path: 'https://image.tmdb.org/t/p/w500/7x7x7x7x7x7x7x7x7x7x7.jpg' },
                    { name: 'Samuel L. Jackson', profile_path: 'https://image.tmdb.org/t/p/w500/te1L5x7x7x7x7x7x7x7x7x7.jpg' }
                ],
                crew: [],
                vote_average: 8.9,
                vote_count: 26000,
                runtime: 154,
                isActive: true
            },
            {
                _id: 'movie_010',
                title: 'The Shawshank Redemption',
                overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
                poster_path: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
                backdrop_path: 'https://image.tmdb.org/t/p/w1280/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg',
                release_date: '1994-09-23',
                original_language: 'en',
                tagline: 'Fear can hold you prisoner. Hope can set you free.',
                genres: [{ name: 'Drama' }],
                casts: [
                    { name: 'Tim Robbins', profile_path: 'https://image.tmdb.org/t/p/w500/8x7x7x7x7x7x7x7x7x7x7.jpg' },
                    { name: 'Morgan Freeman', profile_path: 'https://image.tmdb.org/t/p/w500/oGJQhOpT8S1F56m3o7x7x7x7x7.jpg' }
                ],
                crew: [],
                vote_average: 9.3,
                vote_count: 27000,
                runtime: 142,
                isActive: true
            },
﻿            {
                _id: 'movie_011',
                title: 'Movie Title 11',
                overview: 'An engaging story of character 11 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+11',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+11',
                release_date: '2011-12-12',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Drama' }],
                casts: [
                    { name: 'Actor 11 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+11+A' },
                    { name: 'Actor 11 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+11+B' }
                ],
                crew: [],
                vote_average: 7.6,
                vote_count: 1110,
                runtime: 101,
                isActive: true
            },
            {
                _id: 'movie_012',
                title: 'Movie Title 12',
                overview: 'An engaging story of character 12 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+12',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+12',
                release_date: '2012-01-13',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Comedy' }],
                casts: [
                    { name: 'Actor 12 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+12+A' },
                    { name: 'Actor 12 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+12+B' }
                ],
                crew: [],
                vote_average: 7.7,
                vote_count: 1120,
                runtime: 102,
                isActive: true
            },
            {
                _id: 'movie_013',
                title: 'Movie Title 13',
                overview: 'An engaging story of character 13 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+13',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+13',
                release_date: '2013-02-14',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Sci-Fi' }],
                casts: [
                    { name: 'Actor 13 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+13+A' },
                    { name: 'Actor 13 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+13+B' }
                ],
                crew: [],
                vote_average: 7.8,
                vote_count: 1130,
                runtime: 103,
                isActive: true
            },
            {
                _id: 'movie_014',
                title: 'Movie Title 14',
                overview: 'An engaging story of character 14 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+14',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+14',
                release_date: '2014-03-15',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Thriller' }],
                casts: [
                    { name: 'Actor 14 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+14+A' },
                    { name: 'Actor 14 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+14+B' }
                ],
                crew: [],
                vote_average: 7.9,
                vote_count: 1140,
                runtime: 104,
                isActive: true
            },
            {
                _id: 'movie_015',
                title: 'Movie Title 15',
                overview: 'An engaging story of character 15 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+15',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+15',
                release_date: '2015-04-16',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Romance' }],
                casts: [
                    { name: 'Actor 15 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+15+A' },
                    { name: 'Actor 15 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+15+B' }
                ],
                crew: [],
                vote_average: 8,
                vote_count: 1150,
                runtime: 105,
                isActive: true
            },
            {
                _id: 'movie_016',
                title: 'Movie Title 16',
                overview: 'An engaging story of character 16 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+16',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+16',
                release_date: '2016-05-17',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Crime' }],
                casts: [
                    { name: 'Actor 16 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+16+A' },
                    { name: 'Actor 16 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+16+B' }
                ],
                crew: [],
                vote_average: 8.1,
                vote_count: 1160,
                runtime: 106,
                isActive: true
            },
            {
                _id: 'movie_017',
                title: 'Movie Title 17',
                overview: 'An engaging story of character 17 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+17',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+17',
                release_date: '2017-06-18',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Fantasy' }],
                casts: [
                    { name: 'Actor 17 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+17+A' },
                    { name: 'Actor 17 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+17+B' }
                ],
                crew: [],
                vote_average: 8.2,
                vote_count: 1170,
                runtime: 107,
                isActive: true
            },
            {
                _id: 'movie_018',
                title: 'Movie Title 18',
                overview: 'An engaging story of character 18 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+18',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+18',
                release_date: '2018-07-19',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Animation' }],
                casts: [
                    { name: 'Actor 18 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+18+A' },
                    { name: 'Actor 18 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+18+B' }
                ],
                crew: [],
                vote_average: 8.3,
                vote_count: 1180,
                runtime: 108,
                isActive: true
            },
            {
                _id: 'movie_019',
                title: 'Movie Title 19',
                overview: 'An engaging story of character 19 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+19',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+19',
                release_date: '2019-08-20',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Mystery' }],
                casts: [
                    { name: 'Actor 19 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+19+A' },
                    { name: 'Actor 19 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+19+B' }
                ],
                crew: [],
                vote_average: 8.4,
                vote_count: 1190,
                runtime: 109,
                isActive: true
            },
            {
                _id: 'movie_020',
                title: 'Movie Title 20',
                overview: 'An engaging story of character 20 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+20',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+20',
                release_date: '2020-09-21',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Action' }, { name: 'Adventure' }],
                casts: [
                    { name: 'Actor 20 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+20+A' },
                    { name: 'Actor 20 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+20+B' }
                ],
                crew: [],
                vote_average: 8.5,
                vote_count: 1200,
                runtime: 110,
                isActive: true
            },
            {
                _id: 'movie_021',
                title: 'Movie Title 21',
                overview: 'An engaging story of character 21 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+21',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+21',
                release_date: '2021-10-22',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Drama' }],
                casts: [
                    { name: 'Actor 21 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+21+A' },
                    { name: 'Actor 21 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+21+B' }
                ],
                crew: [],
                vote_average: 8.6,
                vote_count: 1210,
                runtime: 111,
                isActive: true
            },
            {
                _id: 'movie_022',
                title: 'Movie Title 22',
                overview: 'An engaging story of character 22 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+22',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+22',
                release_date: '2022-11-23',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Comedy' }],
                casts: [
                    { name: 'Actor 22 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+22+A' },
                    { name: 'Actor 22 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+22+B' }
                ],
                crew: [],
                vote_average: 8.7,
                vote_count: 1220,
                runtime: 112,
                isActive: true
            },
            {
                _id: 'movie_023',
                title: 'Movie Title 23',
                overview: 'An engaging story of character 23 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+23',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+23',
                release_date: '2023-12-24',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Sci-Fi' }],
                casts: [
                    { name: 'Actor 23 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+23+A' },
                    { name: 'Actor 23 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+23+B' }
                ],
                crew: [],
                vote_average: 8.8,
                vote_count: 1230,
                runtime: 113,
                isActive: true
            },
            {
                _id: 'movie_024',
                title: 'Movie Title 24',
                overview: 'An engaging story of character 24 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+24',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+24',
                release_date: '2024-01-25',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Thriller' }],
                casts: [
                    { name: 'Actor 24 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+24+A' },
                    { name: 'Actor 24 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+24+B' }
                ],
                crew: [],
                vote_average: 8.9,
                vote_count: 1240,
                runtime: 114,
                isActive: true
            },
            {
                _id: 'movie_025',
                title: 'Movie Title 25',
                overview: 'An engaging story of character 25 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+25',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+25',
                release_date: '2000-02-26',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Romance' }],
                casts: [
                    { name: 'Actor 25 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+25+A' },
                    { name: 'Actor 25 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+25+B' }
                ],
                crew: [],
                vote_average: 6.5,
                vote_count: 1250,
                runtime: 115,
                isActive: true
            },
            {
                _id: 'movie_026',
                title: 'Movie Title 26',
                overview: 'An engaging story of character 26 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+26',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+26',
                release_date: '2001-03-27',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Crime' }],
                casts: [
                    { name: 'Actor 26 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+26+A' },
                    { name: 'Actor 26 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+26+B' }
                ],
                crew: [],
                vote_average: 6.6,
                vote_count: 1260,
                runtime: 116,
                isActive: true
            },
            {
                _id: 'movie_027',
                title: 'Movie Title 27',
                overview: 'An engaging story of character 27 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+27',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+27',
                release_date: '2002-04-28',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Fantasy' }],
                casts: [
                    { name: 'Actor 27 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+27+A' },
                    { name: 'Actor 27 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+27+B' }
                ],
                crew: [],
                vote_average: 6.7,
                vote_count: 1270,
                runtime: 117,
                isActive: true
            },
            {
                _id: 'movie_028',
                title: 'Movie Title 28',
                overview: 'An engaging story of character 28 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+28',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+28',
                release_date: '2003-05-01',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Animation' }],
                casts: [
                    { name: 'Actor 28 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+28+A' },
                    { name: 'Actor 28 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+28+B' }
                ],
                crew: [],
                vote_average: 6.8,
                vote_count: 1280,
                runtime: 118,
                isActive: true
            },
            {
                _id: 'movie_029',
                title: 'Movie Title 29',
                overview: 'An engaging story of character 29 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+29',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+29',
                release_date: '2004-06-02',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Mystery' }],
                casts: [
                    { name: 'Actor 29 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+29+A' },
                    { name: 'Actor 29 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+29+B' }
                ],
                crew: [],
                vote_average: 6.9,
                vote_count: 1290,
                runtime: 119,
                isActive: true
            },
            {
                _id: 'movie_030',
                title: 'Movie Title 30',
                overview: 'An engaging story of character 30 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+30',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+30',
                release_date: '2005-07-03',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Action' }, { name: 'Adventure' }],
                casts: [
                    { name: 'Actor 30 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+30+A' },
                    { name: 'Actor 30 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+30+B' }
                ],
                crew: [],
                vote_average: 7,
                vote_count: 1300,
                runtime: 120,
                isActive: true
            },
            {
                _id: 'movie_031',
                title: 'Movie Title 31',
                overview: 'An engaging story of character 31 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+31',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+31',
                release_date: '2006-08-04',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Drama' }],
                casts: [
                    { name: 'Actor 31 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+31+A' },
                    { name: 'Actor 31 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+31+B' }
                ],
                crew: [],
                vote_average: 7.1,
                vote_count: 1310,
                runtime: 121,
                isActive: true
            },
            {
                _id: 'movie_032',
                title: 'Movie Title 32',
                overview: 'An engaging story of character 32 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+32',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+32',
                release_date: '2007-09-05',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Comedy' }],
                casts: [
                    { name: 'Actor 32 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+32+A' },
                    { name: 'Actor 32 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+32+B' }
                ],
                crew: [],
                vote_average: 7.2,
                vote_count: 1320,
                runtime: 122,
                isActive: true
            },
            {
                _id: 'movie_033',
                title: 'Movie Title 33',
                overview: 'An engaging story of character 33 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+33',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+33',
                release_date: '2008-10-06',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Sci-Fi' }],
                casts: [
                    { name: 'Actor 33 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+33+A' },
                    { name: 'Actor 33 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+33+B' }
                ],
                crew: [],
                vote_average: 7.3,
                vote_count: 1330,
                runtime: 123,
                isActive: true
            },
            {
                _id: 'movie_034',
                title: 'Movie Title 34',
                overview: 'An engaging story of character 34 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+34',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+34',
                release_date: '2009-11-07',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Thriller' }],
                casts: [
                    { name: 'Actor 34 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+34+A' },
                    { name: 'Actor 34 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+34+B' }
                ],
                crew: [],
                vote_average: 7.4,
                vote_count: 1340,
                runtime: 124,
                isActive: true
            },
            {
                _id: 'movie_035',
                title: 'Movie Title 35',
                overview: 'An engaging story of character 35 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+35',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+35',
                release_date: '2010-12-08',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Romance' }],
                casts: [
                    { name: 'Actor 35 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+35+A' },
                    { name: 'Actor 35 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+35+B' }
                ],
                crew: [],
                vote_average: 7.5,
                vote_count: 1350,
                runtime: 125,
                isActive: true
            },
            {
                _id: 'movie_036',
                title: 'Movie Title 36',
                overview: 'An engaging story of character 36 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+36',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+36',
                release_date: '2011-01-09',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Crime' }],
                casts: [
                    { name: 'Actor 36 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+36+A' },
                    { name: 'Actor 36 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+36+B' }
                ],
                crew: [],
                vote_average: 7.6,
                vote_count: 1360,
                runtime: 126,
                isActive: true
            },
            {
                _id: 'movie_037',
                title: 'Movie Title 37',
                overview: 'An engaging story of character 37 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+37',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+37',
                release_date: '2012-02-10',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Fantasy' }],
                casts: [
                    { name: 'Actor 37 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+37+A' },
                    { name: 'Actor 37 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+37+B' }
                ],
                crew: [],
                vote_average: 7.7,
                vote_count: 1370,
                runtime: 127,
                isActive: true
            },
            {
                _id: 'movie_038',
                title: 'Movie Title 38',
                overview: 'An engaging story of character 38 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+38',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+38',
                release_date: '2013-03-11',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Animation' }],
                casts: [
                    { name: 'Actor 38 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+38+A' },
                    { name: 'Actor 38 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+38+B' }
                ],
                crew: [],
                vote_average: 7.8,
                vote_count: 1380,
                runtime: 128,
                isActive: true
            },
            {
                _id: 'movie_039',
                title: 'Movie Title 39',
                overview: 'An engaging story of character 39 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+39',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+39',
                release_date: '2014-04-12',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Mystery' }],
                casts: [
                    { name: 'Actor 39 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+39+A' },
                    { name: 'Actor 39 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+39+B' }
                ],
                crew: [],
                vote_average: 7.9,
                vote_count: 1390,
                runtime: 129,
                isActive: true
            },
            {
                _id: 'movie_040',
                title: 'Movie Title 40',
                overview: 'An engaging story of character 40 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+40',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+40',
                release_date: '2015-05-13',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Action' }, { name: 'Adventure' }],
                casts: [
                    { name: 'Actor 40 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+40+A' },
                    { name: 'Actor 40 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+40+B' }
                ],
                crew: [],
                vote_average: 8,
                vote_count: 1400,
                runtime: 130,
                isActive: true
            },
            {
                _id: 'movie_041',
                title: 'Movie Title 41',
                overview: 'An engaging story of character 41 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+41',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+41',
                release_date: '2016-06-14',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Drama' }],
                casts: [
                    { name: 'Actor 41 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+41+A' },
                    { name: 'Actor 41 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+41+B' }
                ],
                crew: [],
                vote_average: 8.1,
                vote_count: 1410,
                runtime: 131,
                isActive: true
            },
            {
                _id: 'movie_042',
                title: 'Movie Title 42',
                overview: 'An engaging story of character 42 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+42',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+42',
                release_date: '2017-07-15',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Comedy' }],
                casts: [
                    { name: 'Actor 42 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+42+A' },
                    { name: 'Actor 42 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+42+B' }
                ],
                crew: [],
                vote_average: 8.2,
                vote_count: 1420,
                runtime: 132,
                isActive: true
            },
            {
                _id: 'movie_043',
                title: 'Movie Title 43',
                overview: 'An engaging story of character 43 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+43',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+43',
                release_date: '2018-08-16',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Sci-Fi' }],
                casts: [
                    { name: 'Actor 43 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+43+A' },
                    { name: 'Actor 43 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+43+B' }
                ],
                crew: [],
                vote_average: 8.3,
                vote_count: 1430,
                runtime: 133,
                isActive: true
            },
            {
                _id: 'movie_044',
                title: 'Movie Title 44',
                overview: 'An engaging story of character 44 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+44',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+44',
                release_date: '2019-09-17',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Thriller' }],
                casts: [
                    { name: 'Actor 44 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+44+A' },
                    { name: 'Actor 44 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+44+B' }
                ],
                crew: [],
                vote_average: 8.4,
                vote_count: 1440,
                runtime: 134,
                isActive: true
            },
            {
                _id: 'movie_045',
                title: 'Movie Title 45',
                overview: 'An engaging story of character 45 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+45',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+45',
                release_date: '2020-10-18',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Romance' }],
                casts: [
                    { name: 'Actor 45 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+45+A' },
                    { name: 'Actor 45 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+45+B' }
                ],
                crew: [],
                vote_average: 8.5,
                vote_count: 1450,
                runtime: 135,
                isActive: true
            },
            {
                _id: 'movie_046',
                title: 'Movie Title 46',
                overview: 'An engaging story of character 46 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+46',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+46',
                release_date: '2021-11-19',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Crime' }],
                casts: [
                    { name: 'Actor 46 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+46+A' },
                    { name: 'Actor 46 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+46+B' }
                ],
                crew: [],
                vote_average: 8.6,
                vote_count: 1460,
                runtime: 136,
                isActive: true
            },
            {
                _id: 'movie_047',
                title: 'Movie Title 47',
                overview: 'An engaging story of character 47 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+47',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+47',
                release_date: '2022-12-20',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Fantasy' }],
                casts: [
                    { name: 'Actor 47 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+47+A' },
                    { name: 'Actor 47 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+47+B' }
                ],
                crew: [],
                vote_average: 8.7,
                vote_count: 1470,
                runtime: 137,
                isActive: true
            },
            {
                _id: 'movie_048',
                title: 'Movie Title 48',
                overview: 'An engaging story of character 48 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+48',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+48',
                release_date: '2023-01-21',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Animation' }],
                casts: [
                    { name: 'Actor 48 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+48+A' },
                    { name: 'Actor 48 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+48+B' }
                ],
                crew: [],
                vote_average: 8.8,
                vote_count: 1480,
                runtime: 138,
                isActive: true
            },
            {
                _id: 'movie_049',
                title: 'Movie Title 49',
                overview: 'An engaging story of character 49 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+49',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+49',
                release_date: '2024-02-22',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Mystery' }],
                casts: [
                    { name: 'Actor 49 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+49+A' },
                    { name: 'Actor 49 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+49+B' }
                ],
                crew: [],
                vote_average: 8.9,
                vote_count: 1490,
                runtime: 139,
                isActive: true
            },
            {
                _id: 'movie_050',
                title: 'Movie Title 50',
                overview: 'An engaging story of character 50 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+50',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+50',
                release_date: '2000-03-23',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Action' }, { name: 'Adventure' }],
                casts: [
                    { name: 'Actor 50 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+50+A' },
                    { name: 'Actor 50 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+50+B' }
                ],
                crew: [],
                vote_average: 6.5,
                vote_count: 1500,
                runtime: 140,
                isActive: true
            },
            {
                _id: 'movie_051',
                title: 'Movie Title 51',
                overview: 'An engaging story of character 51 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+51',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+51',
                release_date: '2001-04-24',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Drama' }],
                casts: [
                    { name: 'Actor 51 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+51+A' },
                    { name: 'Actor 51 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+51+B' }
                ],
                crew: [],
                vote_average: 6.6,
                vote_count: 1510,
                runtime: 141,
                isActive: true
            },
            {
                _id: 'movie_052',
                title: 'Movie Title 52',
                overview: 'An engaging story of character 52 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+52',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+52',
                release_date: '2002-05-25',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Comedy' }],
                casts: [
                    { name: 'Actor 52 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+52+A' },
                    { name: 'Actor 52 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+52+B' }
                ],
                crew: [],
                vote_average: 6.7,
                vote_count: 1520,
                runtime: 142,
                isActive: true
            },
            {
                _id: 'movie_053',
                title: 'Movie Title 53',
                overview: 'An engaging story of character 53 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+53',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+53',
                release_date: '2003-06-26',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Sci-Fi' }],
                casts: [
                    { name: 'Actor 53 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+53+A' },
                    { name: 'Actor 53 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+53+B' }
                ],
                crew: [],
                vote_average: 6.8,
                vote_count: 1530,
                runtime: 143,
                isActive: true
            },
            {
                _id: 'movie_054',
                title: 'Movie Title 54',
                overview: 'An engaging story of character 54 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+54',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+54',
                release_date: '2004-07-27',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Thriller' }],
                casts: [
                    { name: 'Actor 54 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+54+A' },
                    { name: 'Actor 54 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+54+B' }
                ],
                crew: [],
                vote_average: 6.9,
                vote_count: 1540,
                runtime: 144,
                isActive: true
            },
            {
                _id: 'movie_055',
                title: 'Movie Title 55',
                overview: 'An engaging story of character 55 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+55',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+55',
                release_date: '2005-08-28',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Romance' }],
                casts: [
                    { name: 'Actor 55 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+55+A' },
                    { name: 'Actor 55 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+55+B' }
                ],
                crew: [],
                vote_average: 7,
                vote_count: 1550,
                runtime: 145,
                isActive: true
            },
            {
                _id: 'movie_056',
                title: 'Movie Title 56',
                overview: 'An engaging story of character 56 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+56',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+56',
                release_date: '2006-09-01',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Crime' }],
                casts: [
                    { name: 'Actor 56 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+56+A' },
                    { name: 'Actor 56 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+56+B' }
                ],
                crew: [],
                vote_average: 7.1,
                vote_count: 1560,
                runtime: 146,
                isActive: true
            },
            {
                _id: 'movie_057',
                title: 'Movie Title 57',
                overview: 'An engaging story of character 57 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+57',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+57',
                release_date: '2007-10-02',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Fantasy' }],
                casts: [
                    { name: 'Actor 57 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+57+A' },
                    { name: 'Actor 57 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+57+B' }
                ],
                crew: [],
                vote_average: 7.2,
                vote_count: 1570,
                runtime: 147,
                isActive: true
            },
            {
                _id: 'movie_058',
                title: 'Movie Title 58',
                overview: 'An engaging story of character 58 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+58',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+58',
                release_date: '2008-11-03',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Animation' }],
                casts: [
                    { name: 'Actor 58 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+58+A' },
                    { name: 'Actor 58 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+58+B' }
                ],
                crew: [],
                vote_average: 7.3,
                vote_count: 1580,
                runtime: 148,
                isActive: true
            },
            {
                _id: 'movie_059',
                title: 'Movie Title 59',
                overview: 'An engaging story of character 59 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+59',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+59',
                release_date: '2009-12-04',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Mystery' }],
                casts: [
                    { name: 'Actor 59 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+59+A' },
                    { name: 'Actor 59 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+59+B' }
                ],
                crew: [],
                vote_average: 7.4,
                vote_count: 1590,
                runtime: 149,
                isActive: true
            },
            {
                _id: 'movie_060',
                title: 'Movie Title 60',
                overview: 'An engaging story of character 60 that blends emotion, stakes, and spectacle.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+60',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+60',
                release_date: '2010-01-05',
                original_language: 'en',
                tagline: 'Every story has a beginning.',
                genres: [{ name: 'Action' }, { name: 'Adventure' }],
                casts: [
                    { name: 'Actor 60 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+60+A' },
                    { name: 'Actor 60 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+60+B' }
                ],
                crew: [],
                vote_average: 7.5,
                vote_count: 1600,
                runtime: 90,
                isActive: true

            },
            {
                _id: 'movie_061',
                title: 'Starbound Echoes',
                overview: 'A deep-space rescue mission uncovers a signal that could reshape human history.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+61',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+61',
                release_date: '2026-03-14',
                original_language: 'en',
                tagline: 'The signal changes everything.',
                genres: [{ name: 'Sci-Fi' }],
                casts: [
                    { name: 'Actor 61 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+61+A' },
                    { name: 'Actor 61 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+61+B' }
                ],
                crew: [],
                vote_average: 7.8,
                vote_count: 820,
                runtime: 134,
                isActive: true
            },
            {
                _id: 'movie_062',
                title: 'Crimson Harbor',
                overview: 'A coastal town hides a century-old mystery that resurfaces after a storm.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+62',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+62',
                release_date: '2026-04-25',
                original_language: 'en',
                tagline: 'Secrets don?t stay buried.',
                genres: [{ name: 'Mystery' }],
                casts: [
                    { name: 'Actor 62 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+62+A' },
                    { name: 'Actor 62 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+62+B' }
                ],
                crew: [],
                vote_average: 7.3,
                vote_count: 640,
                runtime: 121,
                isActive: true
            },
            {
                _id: 'movie_063',
                title: 'Velocity',
                overview: 'A retired racer returns to the track to mentor a prodigy and face old rivals.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+63',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+63',
                release_date: '2026-06-06',
                original_language: 'en',
                tagline: 'One last lap.',
                genres: [{ name: 'Action' }, { name: 'Drama' }],
                casts: [
                    { name: 'Actor 63 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+63+A' },
                    { name: 'Actor 63 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+63+B' }
                ],
                crew: [],
                vote_average: 7.9,
                vote_count: 910,
                runtime: 128,
                isActive: true
            },
            {
                _id: 'movie_064',
                title: 'Paper Lanterns',
                overview: 'An artist and a journalist uncover a conspiracy tied to a missing mural.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+64',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+64',
                release_date: '2026-08-02',
                original_language: 'en',
                tagline: 'Art speaks when words fail.',
                genres: [{ name: 'Drama' }],
                casts: [
                    { name: 'Actor 64 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+64+A' },
                    { name: 'Actor 64 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+64+B' }
                ],
                crew: [],
                vote_average: 7.1,
                vote_count: 540,
                runtime: 117,
                isActive: true
            },
            {
                _id: 'movie_065',
                title: 'Neon Skies',
                overview: 'In a near-future city, a detective and an AI navigate a high-stakes heist.',
                poster_path: 'https://via.placeholder.com/500x750?text=Movie+65',
                backdrop_path: 'https://via.placeholder.com/1280x720?text=Backdrop+65',
                release_date: '2026-10-10',
                original_language: 'en',
                tagline: 'The future writes its own rules.',
                genres: [{ name: 'Sci-Fi' }, { name: 'Thriller' }],
                casts: [
                    { name: 'Actor 65 A', profile_path: 'https://via.placeholder.com/200x300?text=Actor+65+A' },
                    { name: 'Actor 65 B', profile_path: 'https://via.placeholder.com/200x300?text=Actor+65+B' }
                ],
                crew: [],
                vote_average: 8.0,
                vote_count: 980,
                runtime: 132,
                isActive: true
            }

        ];

        // Seed Movies
        console.log('Seeding Movies...');
        for (const movieData of sampleMovies) {
            const existingMovie = await Movie.findById(movieData._id);
            if (!existingMovie) {
                const movie = new Movie(movieData);
                await movie.save();
                console.log(`✓ Movie "${movieData.title}" added`);
            } else {
                console.log(`- Movie "${movieData.title}" already exists`);
            }
        }

        // Sample Users
        const sampleUsers = [
            {
                _id: 'user_001',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '9876543210'
            },
            {
                _id: 'user_002',
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                phone: '9876543211'
            },
            {
                _id: 'user_003',
                name: 'Mike Johnson',
                email: 'mike@example.com',
                password: 'password123',
                phone: '9876543212'
            }
        ];

        // Seed Users
        console.log('\nSeeding Users...');
        for (const userData of sampleUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = new User({
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    phone: userData.phone
                });
                await user.save();
                console.log(`✓ User "${userData.name}" added (${userData.email})`);
            } else {
                console.log(`- User "${userData.email}" already exists`);
            }
        }

        // Sample Shows - Enhanced with more variety
        console.log('\nSeeding Shows...');
        const baseDate = new Date();
        // Theater IDs matching the dummy theater data
        const theaters = ['theater1', 'theater2', 'theater3'];
        const showTimes = [10, 12, 14, 16, 18, 21]; // More showtimes: 10 AM, 12 PM, 2 PM, 4 PM, 6 PM, 9 PM

        // Create shows for next 14 days
        for (let day = 0; day < 14; day++) {
            const showDate = new Date(baseDate);
            showDate.setDate(showDate.getDate() + day);

            // Distribute movies across theaters and days
            for (let movieIndex = 0; movieIndex < sampleMovies.length; movieIndex++) {
                const movie = sampleMovies[movieIndex];
                const theaterIndex = movieIndex % theaters.length;
                const theater = theaters[theaterIndex];

                // Each movie gets 3-4 showtimes per day
                const movieShowTimes = showTimes.slice(0, 4);
                
                for (const hour of movieShowTimes) {
                    const showDateTime = new Date(showDate);
                    showDateTime.setHours(hour, 0, 0, 0);

                    const showId = `show_${movie._id}_${showDate.toISOString().split('T')[0]}_${theater}_${hour}`;
                    const existingShow = await Show.findById(showId);

                    if (!existingShow) {
                        // Varied pricing: morning shows cheaper, evening shows premium
                        let price = 200;
                        if (hour >= 18) price = 300; // Evening shows
                        else if (hour >= 14) price = 250; // Afternoon shows
                        else price = 200; // Morning shows

                        const show = new Show({
                            _id: showId,
                            movie: movie._id,
                            showDateTime: showDateTime,
                            showPrice: price,
                            occupiedSeats: {},
                            theater: theater
                        });
                        await show.save();
                        console.log(`✓ Show added: ${movie.title} at ${theater} on ${showDateTime.toLocaleString()} - ₹${price}`);
                    }
                }
            }

            // Add some additional shows for popular movies across all theaters
            const popularMovies = sampleMovies.slice(0, 3); // First 3 movies are popular
            for (const movie of popularMovies) {
                for (const theater of theaters) {
                    // Add evening shows (6 PM and 9 PM) for popular movies in all theaters
                    for (const hour of [18, 21]) {
                        const showDateTime = new Date(showDate);
                        showDateTime.setHours(hour, 0, 0, 0);

                        const showId = `show_${movie._id}_${showDate.toISOString().split('T')[0]}_${theater}_${hour}_extra`;
                        const existingShow = await Show.findById(showId);

                        if (!existingShow) {
                            const show = new Show({
                                _id: showId,
                                movie: movie._id,
                                showDateTime: showDateTime,
                                showPrice: hour === 21 ? 350 : 300,
                                occupiedSeats: {},
                                theater: theater
                            });
                            await show.save();
                            console.log(`✓ Extra show: ${movie.title} at ${theater} on ${showDateTime.toLocaleString()}`);
                        }
                    }
                }
            }
        }

        // Sample Bookings - More varied bookings
        console.log('\nSeeding Bookings...');
        const users = await User.find({});
        const shows = await Show.find({}).sort({ showDateTime: 1 }).limit(20);

        // Create multiple bookings per user
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            // Each user gets 2-3 bookings
            const userBookings = shows.slice(i * 2, (i * 2) + 3);
            
            for (let j = 0; j < userBookings.length; j++) {
                const show = userBookings[j];
                if (!show) continue;
                
                // Varied seat selections
                const seatOptions = [
                    ['A1', 'A2'],
                    ['B3', 'B4', 'B5'],
                    ['C1', 'C2', 'C3', 'C4'],
                    ['D5', 'D6'],
                    ['E2', 'E3', 'E4']
                ];
                const seats = seatOptions[j % seatOptions.length];
                const bookingId = `BK${Date.now()}${i}${j}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
                
                const existingBooking = await Booking.findOne({ bookingId });
                if (!existingBooking) {
                    // Check if seats are already occupied
                    const showData = await Show.findById(show._id);
                    const occupiedSeats = showData.occupiedSeats || {};
                    const availableSeats = seats.filter(seat => !occupiedSeats[seat]);
                    
                    if (availableSeats.length === 0) continue; // Skip if all seats taken
                    
                    // Mark seats as occupied in show
                    const newOccupiedSeats = { ...occupiedSeats };
                    availableSeats.forEach(seat => {
                        newOccupiedSeats[seat] = user._id;
                    });

                    await Show.findByIdAndUpdate(show._id, {
                        occupiedSeats: newOccupiedSeats
                    });

                    const booking = new Booking({
                        user: user._id,
                        show: show._id,
                        amount: show.showPrice * availableSeats.length,
                        bookedSeats: availableSeats,
                        isPaid: true,
                        paymentMethod: 'razorpay',
                        paymentStatus: 'completed',
                        razorpayOrderId: `order_${Date.now()}_${i}_${j}`,
                        razorpayPaymentId: `pay_${Date.now()}_${i}_${j}`,
                        bookingId: bookingId
                    });

                    await booking.save();
                    console.log(`✓ Booking created for ${user.name}: ${availableSeats.length} tickets (${availableSeats.join(', ')}) - ₹${booking.amount}`);
                }
            }
        }

        console.log('\n✅ All data seeded successfully!');
        console.log('\nSample Users:');
        console.log('  - john@example.com / password123');
        console.log('  - jane@example.com / password123');
        console.log('  - mike@example.com / password123');
        console.log('\nAdmin:');
        console.log('  - admin@gmail.com / admin@123');

    } catch (error) {
        console.error('✗ Error seeding data:', error.message);
        console.error(error);
    } finally {
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
};

seedAllData();



