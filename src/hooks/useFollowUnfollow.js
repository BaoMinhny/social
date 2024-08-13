import { useState } from 'react'
import useShowToast from './useShowtoast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/usersAtom';

const useFollowUnfollow = (user) => {
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
    const [updating, setUpdating] = useState(false);
    const showToast = useShowToast();  


    const handleFollowUnFollow = async () => {

        if(!currentUser){
            showToast("Error", "Please login to follow", "error")
        }

        if (updating) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method:"POST",

                headers:{
                    "Content-Type": "application/json",
                },
               
            })
            const data = await res.json();
            if(data.error){
              showToast("Error", data.error, "error")
              return;
            }
            console.log(data)

            if(following){
                showToast("Success", `unfollowed ${user.name}` , "success");
                user.followers.pop();
            }
            else
            {
                showToast("Success", `Followed ${user.name}` , "success");
                user.followers.push(currentUser?._id);
            }
            setFollowing(!following)

          } catch (error) {
          showToast("Error", error.message, "error");
            console.log(error)
          }
          finally{
            setUpdating(false)
          }
    } 
  return {handleFollowUnFollow, updating, following}
}

export default useFollowUnfollow
