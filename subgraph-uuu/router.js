import express, { json } from 'express';
import { verify } from 'jsonwebtoken';
import { hash } from 'bcrypt';
import { User } from './models'; // Assuming you have a User model

const app = express();
app.use(json());

app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Start your server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
