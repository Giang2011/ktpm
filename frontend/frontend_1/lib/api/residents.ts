import { privateApi } from "./client";
import { Resident, CreateResidentRequest } from "../types/resident";

export const getResidents = async () => {
  const response = await privateApi.get<Resident[]>("/nhankhau");
  return response.data;
};

export const createResident = async (data: CreateResidentRequest) => {
  const response = await privateApi.post("/nhankhau", data);
  return response.data;
};

export const searchResidents = async (keyword: string) => {
  const response = await privateApi.get<Resident[]>("/nhankhau/search", {
    params: { keyword }
  });
  return response.data;
};