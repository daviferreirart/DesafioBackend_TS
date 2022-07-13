export const query = `select s.status_name from "Subscription" s2  inner join "Status" s on s.id =s2.status_id
    inner join "User" u on u.id=s2.user_id where u.id=`;
export const userInfo = `select
u.id id_User,
s2.id id_status,
u.full_name username,
s2.status_name STATUS ,
s.updated_at ,
s.created_at,
eh."type" EventoTIPO,
eh.created_at 
from
"User" u
inner join "Subscription" s on
u.id = s.user_id
inner join "Status" s2 on
s2.id = s.status_id
inner join "EventHistory" eh on
eh.subscription_id = s.id
where u.id =`;
