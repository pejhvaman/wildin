import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import FormRowValid from "../../ui/FormRowValid";

function CreateCabinForm() {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;
  // console.log(errors);
  console.log(getValues().regularPrice);

  const { mutate, isLoading } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("created succesfuly");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    mutate(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowValid label="cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required!",
          })}
        />
      </FormRowValid>

      <FormRowValid
        label="maximum capacity"
        error={errors?.maxCapacity?.message}
      >
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required!",
            min: {
              value: 1,
              message: "Each cabin has at least 1 person capacity!",
            },
          })}
        />
      </FormRowValid>

      <FormRowValid label="cabin price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required!",
            min: {
              value: 100,
              message: "Each cabin has at least 100$ price!",
            },
          })}
        />
      </FormRowValid>

      <FormRowValid label="discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required!",
            validate: (value) =>
              value <= +getValues().regularPrice ||
              "Discount should be less than cabin price!",
          })}
        />
      </FormRowValid>

      <FormRowValid label="description" error={errors?.description?.message}>
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required!",
            minLength: {
              value: 8,
              message: "Describe the cabin at least a little!",
            },
          })}
        />
      </FormRowValid>

      <FormRowValid label="photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          defaultValue={null}
          {...register("image")}
        />
      </FormRowValid>

      <FormRowValid>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isLoading}>Create cabin</Button>
      </FormRowValid>
    </Form>
  );
}

export default CreateCabinForm;
