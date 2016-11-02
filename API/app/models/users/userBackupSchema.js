var UserSchema = new Schema({
	username: {type: String, required:true},
	password: {type: String, required:true},
	userInformation: [
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    paid: {type: Number, required: true},
    avatar: {type: String, required:true},
    phonebook: [
        friends: [User.ObjectId]
    ],
    groups: [
      groupName: {type: String, required: true},
      members: [
      users: [user.]
    ]],
    notes: [
      _id: String,
      title: String,
      locked: Boolean,
      type: [
        noteTemplate: String,
      ],
      shared: [
        group: [
          _id: String,
        ],
        collaborators: [
          _id: String,
        ]]]],

	__v: {type:Number, select: false}
}, {versionKey: false});
