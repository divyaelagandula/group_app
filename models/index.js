const user=require('../models/user');
const group=require('../models/group');
const archivedChat=require('../models/archivedmsgs')
user.hasMany(group);
group.belongsTo(user);
user.hasMany(archivedChat)
archivedChat.belongsTo(user)
module.exports={
    user,
    group,
    archivedChat

}
