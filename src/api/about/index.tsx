import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../axios.config";
import { routes } from "../routes";
import { ISingleAbout, PatchAbout } from "@/types/about";

const editAbout = async (val: PatchAbout) => {
  let editData = { ...val };
  delete editData?.id;
  const { data } = await axiosInstance.patch(
    `${routes.about}/${val?.id}`,
    editData
  );
  return data;
};

const singleAbout = async (): Promise<ISingleAbout> => {
  const { data } = await axiosInstance?.get(
    `${routes.about}/${process.env.NEXT_PUBLIC_ABOUTUS_API_ID}`
  );
  return data;
};

export const useEditAbout = () => {
  return useMutation({
    mutationFn: editAbout,
  });
};

export const useGetAbout = () => {
  return useQuery({
    queryKey: [`${routes["about"]}`],
    queryFn: () => singleAbout(),
    refetchOnMount: true,
  });
};
