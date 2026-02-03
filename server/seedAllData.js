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



