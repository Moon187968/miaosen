import { NextRequest, NextResponse } from 'next/server';
import { createRegion, updateRegion, deleteRegion } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // 返回静态的中国省市数据，不依赖数据库
    const regions = [
      {
        id: "region_1",
        name: "北京市",
        description: "中国首都，政治、文化、国际交往中心",
        image: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?q=80&w=800",
        latitude: 39.9042,
        longitude: 116.4074,
        created_at: new Date() .toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "region_2",
        name: "上海市",
        description: "中国经济、金融、贸易、航运中心",
        image: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?q=80&w=800",
        latitude: 31.2304,
        longitude: 121.4737,
        created_at: new Date() .toISOString(),
        updated_at: new Date().toISOString()
      },
      // 更多省市...
    ];
    
    return NextResponse.json(regions);
  } catch (error) {
    console.error('获取地区数据失败:', error);
    return NextResponse.json({ error: '获取地区数据失败' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const env = request.env as any;
    
    // 验证必填字段
    if (!data.name) {
      return NextResponse.json({ error: '地区名称为必填项' }, { status: 400 });
    }
    
    // 创建地区
    const regionId = await createRegion(env.DB, data);
    
    return NextResponse.json({ id: regionId, success: true });
  } catch (error) {
    console.error('创建地区失败:', error);
    return NextResponse.json({ error: '创建地区失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: '缺少地区ID' }, { status: 400 });
    }
    
    const data = await request.json();
    const env = request.env as any;
    
    // 更新地区
    const success = await updateRegion(env.DB, id, data);
    
    if (!success) {
      return NextResponse.json({ error: '地区不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新地区失败:', error);
    return NextResponse.json({ error: '更新地区失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: '缺少地区ID' }, { status: 400 });
    }
    
    const env = request.env as any;
    
    // 删除地区
    const success = await deleteRegion(env.DB, id);
    
    if (!success) {
      return NextResponse.json({ error: '地区不存在或有关联产品无法删除' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除地区失败:', error);
    return NextResponse.json({ error: '删除地区失败' }, { status: 500 });
  }
}
