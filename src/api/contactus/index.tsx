import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../axios.config";
import { routes } from "../routes";
import { ISingleContact, PatchContact } from "@/types/contact";

const editContact = async (val: PatchContact) => {
  let editData = { ...val };
  delete editData?.id;
  const { data } = await axiosInstance.patch(
    `${routes.contact}/${val?.id}`,
    editData
  );
  return data;
};

const singleContact = async (): Promise<ISingleContact> => {
  const { data } = await axiosInstance?.get(
    `${routes.contact}/${process.env.NEXT_PUBLIC_CONTACT_API_ID}`
  );
  return data;
};

export const useEditContact = () => {
  return useMutation({
    mutationFn: editContact,
  });
};

export const useGetContact = () => {
  return useQuery({
    queryKey: [`${routes["contact"]}`],
    queryFn: () => singleContact(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
