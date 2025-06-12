import { getUserDetails, updateUserData } from "@/actions/user";


export const GET =async (request) => {
  const userData=await getUserDetails();
  return new Response(JSON.stringify(userData));
};


export const POST=async(request)=>{
  const userData=await updateUserData(await request.json());
  return new Response(JSON.stringify(userData));
}

