import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';

// 简单的登录验证
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 });
    }
    
    const env = request.env as any;
    
    // 从数据库获取用户
    const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first();
    
    if (!user) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }
    
    // 创建会话（简单实现，实际应使用更安全的方式）
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天后过期
    
    return NextResponse.json({ 
      success: true,
      message: '登录成功'
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json({ 
      success: false,
      error: '登录失败，请检查用户名和密码'
    }, { status: 401 });
  }
}
