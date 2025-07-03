import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const userAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoaded: false,

    register: async (fullname, email, password) => {
        set({ isLoaded: true });

        try {
            const response = await fetch("http://192.168.1.7:8000/api/auth/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullname,
                    email,
                    password
                })
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Invalid JSON response:", text);
                throw new Error("Server did not return valid JSON.");
            }

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            // console.log(data);
            await AsyncStorage.setItem('token', data.token);
            set({ isLoaded: false });
            return { success: true }
        } catch (error) {
            set({ isLoaded: false });
            return { success: false, error: error.message }
        }
    },

    login: async (email, password) => {
        set({ isLoaded: true });
        try {
            const response = await fetch("http://192.168.1.7:8000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error("Invalid JSON response:", text);
                throw new Error("Server did not return valid JSON.");
            }

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            // console.log(data);

            set({ isLoaded: false });
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            set({ token: data.token });
            set({ user: data.user });
            return { success: true };
        } catch (error) {
            set({ isLoaded: false });
            return { success: false, error: error.message }
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const user = await AsyncStorage.getItem("user");

            if (token) set({ token });
            if (user) set({ user: JSON.parse(user) });
        } catch (error) {
            console.log("Auth check failed.", error.message);
        }
    },



    logOut: async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            set({ token: null, user: null });
        } catch (error) {
            console.log("Logout error", error.message);
        }
    },

    update: async (newUser) => {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        set({ user: newUser });
    }

}))