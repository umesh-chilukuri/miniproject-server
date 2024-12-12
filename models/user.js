import mongoose, { Schema, model } from "mongoose";
import { hash } from "bcrypt";

const schema = new Schema(
  {
    
    userid: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Regular expression to allow any combination of alphabets and numbers
          const pattern = /^[A-Za-z0-9]+$/;
          return pattern.test(value);
        },
        message: (props) => `${props.value} is not a valid userid. UserID should only contain letters and numbers.`,
      },
    },
    
    password: {
      type:String ,
      required: true,
      select: false, // Prevent the password from being returned in queries
    },
    name: {
      type: String,
      default: "Anonymous", // Optional default name
    },
    bio: {
      type: String,
      default: "", // Optional default bio
    },
    
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        default: "https://example.com/default-avatar.png", // Default profile image URL
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Hash password only if modified

  this.password = await hash(this.password, 10); // Hash the password with bcrypt
});

export const User = mongoose.models.User || model("User", schema);
