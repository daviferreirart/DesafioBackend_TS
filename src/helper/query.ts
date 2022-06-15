export const query =`select s.status_name from "Subscription" s2  inner join "Status" s on s.id =s2.status_id
    inner join "User" u on u.id=s2.user_id where u.id=`