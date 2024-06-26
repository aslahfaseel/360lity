"use client";
import Button from "@/UI/Button";
import ImagePreview from "@/UI/ImagePreview";
import Input from "@/UI/Input";
import Loader from "@/UI/Loader";
import { useCreateBlog, useEditBlog } from "@/api/blog";
import { useDelete, useUpload } from "@/api/image";
import { transformFile } from "@/utils/transformFile";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { z } from "zod";
import dynamic from "next/dynamic";
import { Blog } from "../../types/blog";
import { convert } from "html-to-text";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const BlogSchema = z.object({
  title: z.string().min(1, "Please enter a blog title"),
  description: z.string().min(3, "Please enter a description"),
  image: z.string().min(1, "Please upload a image"),
  priority: z.coerce.number().gte(1, "Please enter a priority"),
});

type BlogSchemaType = z.infer<typeof BlogSchema>;

function htmlDecode(content: string) {
  let e = document.createElement("div");
  e.innerHTML = content;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}
const BlogAddForm: React.FC<{ initialValues?: Blog }> = ({ initialValues }) => {
  const router = useRouter();
  const decodeValue = htmlDecode(initialValues?.description as string);
  const text = convert(decodeValue as string);
  console.log(text, "text");

  const { mutate: create, isPending: createLoader } = useCreateBlog();
  const { mutate: edit, isPending: editLoader } = useEditBlog();
  const { mutate: upload, isPending: uploadLoader } = useUpload();
  const { mutate: deleteImage, isPending: deleteLoader } = useDelete();
  const imageloader = uploadLoader || deleteLoader;
  const loader = createLoader;
  const buttonText = initialValues ? "Update" : "Add Blog";
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm<BlogSchemaType>({
    resolver: zodResolver(BlogSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initialValues) {
      setValue("title", initialValues.title);
      setValue("description", text);
      setValue("image", initialValues.image);
      setValue("priority", initialValues.priority);
    }
  }, [initialValues, setValue, text]);

  const onSubmit: SubmitHandler<BlogSchemaType> = (data) => {
    if (initialValues) {
      edit(
        {
          ...data,
          id: initialValues?._id,
          ...(data?.image?.length ? { image: data?.image } : { image: null }),
        },
        {
          onSuccess: (res) => {
            toast.success("Blog updated.");
          },
        }
      );
    } else {
      create(
        {
          ...data,
          ...(data?.image?.length ? { image: data?.image } : { image: null }),
        },
        {
          onSuccess: (res) => {
            toast.success("New blog added.");
            router.replace("/admin/blog");
          },
        }
      );
    }
  };

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let formData = new FormData();

    const imageFile = e.target.files?.[0];

    const imgValue = await transformFile(imageFile as File);

    if (imgValue) {
      console.log(imgValue, "img");
      formData.append("image", imageFile!);

      const data = {
        image: imgValue,
        preset: "Blogs",
      };

      upload(data, {
        onSuccess: (res) => {
          console.log(res, "res");
          const imgUrl = res?.data?.secure_url;
          setValue("image", imgUrl);
        },
      });
    }
  };

  const deleteHandler = () => {
    const imgValue = getValues("image");
    const data = {
      image: imgValue,
      folder: "blogs",
    };

    deleteImage(data, {
      onSuccess: (res) => {
        console.log(res, "res");
        setValue("image", "");
      },
    });
  };

  return (
    <div className="mt-10 max-w-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
        action=""
      >
        {imageloader ? (
          <div className="flex justify-center py-6 w-[45%]">
            <Loader />
          </div>
        ) : watch("image")?.length ? (
          <ImagePreview
            src={watch("image") as string}
            alt="project"
            deleteHandler={deleteHandler}
          />
        ) : (
          <div>
            <label
              className="bg-[#0060E4] flex items-center w-40 gap-2 cursor-pointer text-sm justify-center rounded-x text-white font-semibold px-5 py-3"
              htmlFor="image"
            >
              <ArrowUpTrayIcon className="w-5 h-5" /> Upload image
            </label>
            <input
              id={"image"}
              onChange={imageHandler}
              name="image"
              className="w-full hidden"
              type="file"
            />
            {errors?.image && (
              <p className="text-red-700 text-sm font-medium mt-3">
                {errors?.image?.message}
              </p>
            )}
            <div className="text-sm text-gray-400 mt-2 ml-7">
              (250px x 144px)
            </div>
          </div>
        )}
        <Input
          id={"title"}
          name="title"
          register={register}
          label="Blog title"
          error={errors?.title?.message}
          className="w-full"
        />
        {!initialValues && (
          <Input
            id={"priority"}
            name="priority"
            type="tel"
            register={register}
            label="Display Priority"
            error={errors?.priority?.message}
            className="w-full"
          />
        )}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value, name } }) => {
            return (
              <QuillNoSSRWrapper
                className="bg-white rounded-x min-h-[250px]"
                theme="snow"
                value={value}
                onChange={onChange}
              ></QuillNoSSRWrapper>
            );
          }}
        />

        <Button
          type="submit"
          loading={loader}
          disabled={loader || imageloader}
          text={buttonText}
        />
      </form>
    </div>
  );
};

export default BlogAddForm;
