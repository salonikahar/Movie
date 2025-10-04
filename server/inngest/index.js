import { Inngest } from "inngest";
import User from '../models/User.js';



// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest function to save user data to a database 
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({ event }) => {
        const {id, first_name,  last_name, email_addresses, image_url} = event.data;
        const userData = {
            _id: id,
            email: Array.isArray(email_addresses) && email_addresses.length > 0 ? email_addresses[0].email_address : "",
            name: first_name + " " + last_name,
            image: image_url
        }
        try {
            await User.create(userData);
        } catch (error) {
            console.error("Error creating user:", error);
        }

const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},
    async ({ event }) => {
        
        const {id} = event.data;
        try {
            await User.findByIdAndDelete(id);
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
            // Optionally, you can throw the error or handle it as needed
        }

    }
)
        await User.findByIdAndDelete(id)

    }
)

// Inngest function to update user from database
const syncUserUpdation = inngest.createFunction(
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            image: image_url
        }
        try {
            await User.findByIdAndUpdate(id, userData);
        } catch (error) {
            console.error("Error updating user:", error);
        }

    }
)
        }
        await User.findByIdAndUpdate(id, userData)

    }
)


export const functions = [
    syncUserCreation, 
    syncUserDeletion,
    syncUserUpdation
]; 
