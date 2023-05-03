import {PUBLIC_API_URI} from "$env/static/public";
import type { Friend } from "../types/friend.js";
import type { User } from "../types/user.js";

let userservice : UserService;

export class UserService
{
    constructor ()
    {

    }

    /**
     * return the status of login
     *
     * @returns Promise<boolean> true if the user is logged
     */
    async isLogged() : Promise<boolean>
    {
        console.log("isLogged start");

        let logged: boolean;

        let res: Response = await fetch(`${PUBLIC_API_URI}/auth/islogged`, {
            method: 'GET',
            credentials: 'include'
        });

        res = await res.json();
        if (!res)
            logged = false;
        else
            logged = true;

        return Promise.resolve(logged);
    }

    async getCurrentUser() : Promise<User>
    {
        console.log("getCurrentUser start");

        let logged: boolean;

        let res: Response = await fetch(`${PUBLIC_API_URI}/user/me`, {
            method: 'GET',
            credentials: 'include'
        });

        return await res.json();
    }

    async getFriends() : Promise<Array<User>>
    {
        let users: Array<User> = new Array;

        let res: Response = await fetch(`${PUBLIC_API_URI}/user/friend`, {
            method: 'GET',
            credentials: 'include'
        });

        const friends_list: Array<Friend> = (await res.json()).friend;

        console.log (friends_list);

        for (const item of friends_list) {
            let id = item.friend_id;
            try {
                if (item.accept_at == null)
                    continue;
                const res: Response = await fetch(`${PUBLIC_API_URI}/user/id/${id}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const new_friend: User = (await res.json());
                users.push(new_friend);
            }
            catch (err)
            {
                console.error(err);
            }
        }

        return Promise.resolve(users);

    }

    async searchUser(value : string) : Promise<Array<User>>
    {
        const res: Response = await fetch(`${PUBLIC_API_URI}/user/search?skip=0&take=10&element=name&value=` + value, {
            method: 'GET',
            credentials: 'include'
        });

        return await res.json();
    }



}

// singleton
userservice = new UserService();

export default userservice;
