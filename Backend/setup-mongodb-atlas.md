# MongoDB Atlas Setup Guide for QuizGen

## 🗄️ Step-by-Step MongoDB Atlas Setup

### **Step 1: Create MongoDB Atlas Account**

1. **Visit MongoDB Atlas**: Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Sign Up**: Create a free account or sign in
3. **Choose Plan**: Select **FREE** tier (M0 Sandbox)

### **Step 2: Create Your Cluster**

1. **Click "Build a Database"**
2. **Choose Configuration**:
   - **Cloud Provider**: AWS, Google Cloud, or Azure (your choice)
   - **Region**: Choose closest to you
   - **Cluster Tier**: M0 Sandbox (FREE)
   - **Cluster Name**: `quizgen-cluster`
3. **Click "Create"**

### **Step 3: Set Up Database User**

1. **Go to Security → Database Access**
2. **Click "Add New Database User"**
3. **Configure User**:
   - **Username**: `quizgen-user`
   - **Password**: Create a strong password (save this!)
   - **Database User Privileges**: "Read and write to any database"
4. **Click "Add User"**

### **Step 4: Configure Network Access**

1. **Go to Security → Network Access**
2. **Click "Add IP Address"**
3. **Choose Option**:
   - **For Development**: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **For Production**: Add specific IP addresses
4. **Click "Confirm"**

### **Step 5: Get Connection String**

1. **Go to Database → Connect**
2. **Choose "Connect your application"**
3. **Select**:
   - **Driver**: Node.js
   - **Version**: 5.0 or later
4. **Copy the connection string**

### **Step 6: Update Your Environment**

1. **Copy the connection string**
2. **Replace placeholders**:
   - `<username>` → `quizgen-user`
   - `<password>` → Your actual password
   - `<cluster>` → Your cluster name
3. **Update your `.env` file**:

```env
MONGODB_URI=mongodb+srv://quizgen-user:your-actual-password@cluster0.xxxxx.mongodb.net/quizgen?retryWrites=true&w=majority
```

### **Step 7: Test Connection**

1. **Start your server**: `npm run dev`
2. **Check console**: Should see "Connected to MongoDB"
3. **Test health endpoint**: `GET http://localhost:5000/health`

## 🔧 Connection String Format

Your connection string should look like this:
```
mongodb+srv://quizgen-user:your-password@cluster0.xxxxx.mongodb.net/quizgen?retryWrites=true&w=majority
```

**Components**:
- `quizgen-user`: Your database username
- `your-password`: Your database password
- `cluster0.xxxxx.mongodb.net`: Your cluster URL
- `quizgen`: Database name
- `retryWrites=true&w=majority`: Connection options

## 🚀 For Render Deployment

When deploying to Render, use the same MongoDB Atlas connection string:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://quizgen-user:your-password@cluster0.xxxxx.mongodb.net/quizgen?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url.onrender.com
```

## 🔒 Security Best Practices

1. **Strong Password**: Use a complex password for database user
2. **Network Access**: Limit IP access in production
3. **Environment Variables**: Never commit `.env` files to git
4. **Regular Backups**: MongoDB Atlas provides automatic backups

## 📊 Monitoring

- **MongoDB Atlas Dashboard**: Monitor your database performance
- **Metrics**: Track connections, operations, and storage
- **Alerts**: Set up alerts for unusual activity

## 🆘 Troubleshooting

### **Connection Issues**:
1. **Check Network Access**: Ensure your IP is whitelisted
2. **Verify Credentials**: Double-check username and password
3. **Check Cluster Status**: Ensure cluster is running

### **Common Errors**:
- **Authentication Failed**: Wrong username/password
- **Network Timeout**: Check network access settings
- **Cluster Not Found**: Verify cluster name in connection string

## 📞 Support

- **MongoDB Atlas Documentation**: [https://docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **MongoDB Community**: [https://community.mongodb.com](https://community.mongodb.com) 