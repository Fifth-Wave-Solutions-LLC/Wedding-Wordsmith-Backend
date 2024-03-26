import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  _confirmPassword: string;
  roles: number[];
  sponsor?: mongoose.Schema.Types.ObjectId;
  tokenBalance: number;
  accessExpires?: mongoose.Schema.Types.Date;
  createdAt: mongoose.Schema.Types.Date;
  updatedAt: mongoose.Schema.Types.Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    firstName: {
      type: String,
      required: [true, "First name is required"]
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"]
    },
    userName: {
      type: String,
      required: [true, "User name is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (val: string) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email"
      }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be 8 characters or longer"]
    },
    roles: [{
      type: Number
    }],
    sponsor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }, 
    tokenBalance: {
      type: Number
    },
    accessExpires: {
      type: Date
    }
  }, {
    timestamps: true
  });
  

/* Mongoose virtual for 'confirmPassword' field */
UserSchema.virtual('confirmPassword')
.get( function (): string { return this._confirmPassword})  // getter
.set( function (value: string): void { this._confirmPassword = value } ) // setter

/* Before saving, validate by comparing 'password' to 'confirmPassword */
UserSchema.pre('validate', function(next): void {
  if (this.password !== this._confirmPassword) {
    this.invalidate('confirmPassword', 'Password must match confirm password');
  }
  next();
})

/* Before saving, convert 'password' to hash with bcrypt */
UserSchema.pre('save', function(next): void {
  bcrypt.hash(this.password, 10) // bcrypt.hash returns a promise. 10 salt 'rounds'
    .then((hash: string): void => { 
      this.password = hash;
      next();
    }); 
  }
);

export default mongoose.model<IUser>("User", UserSchema)