const user=require('../models/user');
const group=require('../models/group');
user.hasMany(group);
group.belongsTo(user);
module.exports={
    user,
    group,

}
