import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    const uri = `${process.env.MONGO_URI_BASE}${process.env.DB_NAME}${process.env.MONGO_URI_OPTIONS}`;
    await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB; 