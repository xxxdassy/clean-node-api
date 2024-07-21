export default {
  mongoUrl:
    process.env.MONGO_URL ||
    'mongodb+srv://developerjjonathan:developerjjonathan@cluster0.w6nafgm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  port: process.env.PORT || 5050,
}
