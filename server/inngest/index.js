import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest function to save user data to a database 
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({ event }) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data;
        const userData = {
            _id: id,
            email: Array.isArray(email_addresses) && email_addresses.length > 0 ? email_addresses[0].email_address : "",
            name: first_name + " " + last_name,
            image: image_url
        };
        try {
            await User.create(userData);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    }
); // <-- This closes syncUserCreation

// Inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},
    async ({ event }) => {
        const {id} = event.data;
        try {
            await User.findByIdAndDelete(id);
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
        }
    }
); // <-- This closes syncUserDeletion

// Inngest function to update user from database
const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async ({ event }) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data;
        const userData = {
            _id: id,
            email: Array.isArray(email_addresses) && email_addresses.length > 0 ? email_addresses[0].email_address : "",
            name: first_name + " " + last_name,
            image: image_url
        };
        try {
            await User.findByIdAndUpdate(id, userData);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }
); // <-- This closes syncUserUpdation

export const functions = [
    syncUserCreation, 
    syncUserDeletion,
    syncUserUpdation
];
