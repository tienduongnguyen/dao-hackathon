import { axiosWrapper } from "../helpers/axiosInstance";

const baseUrl = `/user`;

const getUser = async (walletAddress: string) => {
    return await axiosWrapper.get(
        `${baseUrl}/get-user?wallet_address=${walletAddress}`);
};
const createUser = async (walletAddress: string) => {
    return await axiosWrapper.post(
        `${baseUrl}/create-user`, { wallet_address: walletAddress }
    );
};

export const userService = {
    getUser,
    createUser,
};
