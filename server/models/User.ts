import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { isDbConnected } from '../db/connection.js';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: string;
  avatarUrl?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      default: 'executive',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    jobTitle: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving via Mongoose hook
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const UserModel: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

// Fallback in-memory document store
interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  avatarUrl?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const fallbackUsers: Map<string, StoredUser> = new Map();

export const UserRepository = {
  async findByEmail(email: string): Promise<{ id: string; name: string; email: string; password: string; role?: string; avatarUrl?: string; jobTitle?: string; phone?: string; location?: string; bio?: string; createdAt: Date } | null> {
    const normalizedEmail = email.toLowerCase().trim();
    if (isDbConnected()) {
      try {
        const user: any = await UserModel.findOne({ email: normalizedEmail }).exec();
        if (user) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            avatarUrl: user.avatarUrl || '',
            jobTitle: user.jobTitle || '',
            phone: user.phone || '',
            location: user.location || '',
            bio: user.bio || '',
            createdAt: user.createdAt,
          };
        }
      } catch (err) {
        console.error('[User Model] findByEmail DB error:', err);
      }
    }

    for (const user of fallbackUsers.values()) {
      if (user.email === normalizedEmail) {
        return user;
      }
    }
    return null;
  },

  async findById(id: string): Promise<UserDTO | null> {
    if (isDbConnected()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          const user: any = await UserModel.findById(id).select('-password').exec();
          if (user) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
              avatarUrl: user.avatarUrl || '',
              jobTitle: user.jobTitle || '',
              phone: user.phone || '',
              location: user.location || '',
              bio: user.bio || '',
              createdAt: user.createdAt,
            };
          }
        }
      } catch (err) {
        console.error('[User Model] findById DB error:', err);
      }
    }

    const user = fallbackUsers.get(id);
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || '',
        jobTitle: user.jobTitle || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        createdAt: user.createdAt,
      };
    }
    return null;
  },

  async create(userData: { name: string; email: string; password: string }): Promise<UserDTO> {
    const normalizedEmail = userData.email.toLowerCase().trim();

    if (isDbConnected()) {
      try {
        const newUser: any = await UserModel.create({
          name: userData.name.trim(),
          email: normalizedEmail,
          password: userData.password,
          avatarUrl: '',
          jobTitle: '',
          phone: '',
          location: '',
          bio: '',
        });
        return {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatarUrl: newUser.avatarUrl || '',
          jobTitle: newUser.jobTitle || '',
          phone: newUser.phone || '',
          location: newUser.location || '',
          bio: newUser.bio || '',
          createdAt: newUser.createdAt,
        };
      } catch (err: any) {
        console.error('[User Model] Create in DB failed:', err.message);
        throw err;
      }
    }

    // Fallback in-memory user creation with bcrypt hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const storedUser: StoredUser = {
      id: newId,
      name: userData.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'executive',
      avatarUrl: '',
      jobTitle: '',
      phone: '',
      location: '',
      bio: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    fallbackUsers.set(newId, storedUser);
    return {
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      role: storedUser.role,
      avatarUrl: storedUser.avatarUrl,
      jobTitle: storedUser.jobTitle,
      phone: storedUser.phone,
      location: storedUser.location,
      bio: storedUser.bio,
      createdAt: storedUser.createdAt,
    };
  },

  async updateProfile(
    userId: string,
    profileData: {
      name?: string;
      avatarUrl?: string;
      jobTitle?: string;
      phone?: string;
      location?: string;
      bio?: string;
    }
  ): Promise<UserDTO | null> {
    const cleanUpdates: Record<string, any> = {};
    if (typeof profileData.name === 'string') cleanUpdates.name = profileData.name.trim();
    if (typeof profileData.avatarUrl === 'string') cleanUpdates.avatarUrl = profileData.avatarUrl;
    if (typeof profileData.jobTitle === 'string') cleanUpdates.jobTitle = profileData.jobTitle.trim();
    if (typeof profileData.phone === 'string') cleanUpdates.phone = profileData.phone.trim();
    if (typeof profileData.location === 'string') cleanUpdates.location = profileData.location.trim();
    if (typeof profileData.bio === 'string') cleanUpdates.bio = profileData.bio.trim();

    if (isDbConnected()) {
      try {
        if (mongoose.isValidObjectId(userId)) {
          const updatedUser: any = await UserModel.findByIdAndUpdate(
            userId,
            { $set: cleanUpdates },
            { new: true, runValidators: true }
          )
            .select('-password')
            .exec();

          if (updatedUser) {
            return {
              id: updatedUser._id.toString(),
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              avatarUrl: updatedUser.avatarUrl || '',
              jobTitle: updatedUser.jobTitle || '',
              phone: updatedUser.phone || '',
              location: updatedUser.location || '',
              bio: updatedUser.bio || '',
              createdAt: updatedUser.createdAt,
            };
          }
        }
      } catch (err) {
        console.error('[User Model] updateProfile DB error:', err);
      }
    }

    const user = fallbackUsers.get(userId);
    if (user) {
      if (cleanUpdates.name !== undefined) user.name = cleanUpdates.name;
      if (cleanUpdates.avatarUrl !== undefined) user.avatarUrl = cleanUpdates.avatarUrl;
      if (cleanUpdates.jobTitle !== undefined) user.jobTitle = cleanUpdates.jobTitle;
      if (cleanUpdates.phone !== undefined) user.phone = cleanUpdates.phone;
      if (cleanUpdates.location !== undefined) user.location = cleanUpdates.location;
      if (cleanUpdates.bio !== undefined) user.bio = cleanUpdates.bio;
      user.updatedAt = new Date();

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || '',
        jobTitle: user.jobTitle || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        createdAt: user.createdAt,
      };
    }

    return null;
  },

  async comparePassword(candidatePassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hash);
  },
};
