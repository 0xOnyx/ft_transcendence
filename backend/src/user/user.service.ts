import { Injectable } from '@nestjs/common';
import {UserService} from "../prisma/user.service";
import {Prisma, User, Friend} from "@prisma/client";


@Injectable()
export class UserServiceService {
    constructor(private userService: UserService) {
    }

    getUser(id: number) {
        return this.userService.user({id: id})
    }

    async getFriend(id: number) {
        const friend: any = await this.userService.userSelect({id: id}, {
            id: true,
            friend: true,
            symetric_friend: true,
        })
        if (!friend)
            return {};
        return {
            id: friend.id,
            friend: [...friend.friend, ...friend.symetric_friend]
        }
    }

	async getBlockedUser(id: number) {
        const user: any = await this.userService.userSelect({id: id}, {
            id: true,
            lock_user: true,
        })
        if (!user)
            return {};
        return {
            id: user.id,
            blockedUsers: [...user.lock_user]
        }
    }

    getSearch(queryList: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        return this.userService.Users(queryList);
    }

    updateUser(id: number, data: Prisma.UserUpdateInput) {
        let to_change: Prisma.UserUpdateInput = {};
        if (data.name)
            to_change.name = data.name;
        return this.userService.updateUser({where: {id: id}, data: to_change});
    }

    async isBlockedByMe(id_user: number, id_user_check: number)
    {
        const block_user = await this.userService.getBlockUser({id: id_user}, {id: id_user_check});
        return (!!block_user.find(item=>{return(item.lock_user_id == id_user_check)}));
    }

}
