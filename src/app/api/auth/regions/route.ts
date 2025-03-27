import { NextRequest, NextResponse } from 'next/server';
import { createRegion, updateRegion, deleteRegion, getAllRegions } from '@/lib/db';

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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "region_2",
        name: "上海市",
        description: "中国经济、金融、贸易、航运中心",
        image: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?q=80&w=800",
        latitude: 31.2304,
        longitude: 121.4737,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "region_3",
        name: "广东省",
        description: "中国改革开放的前沿，经济发达省份",
        image: "https://images.unsplash.com/photo-1567871376713-0b7cf8a5a1a9?q=80&w=800",
        latitude: 23.1357,
        longitude: 113.2615,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "region_4",
        name: "四川省",
        description: "中国西南地区重要省份，美食与熊猫之乡",
        image: "https://images.unsplash.com/photo-1505651568058-90e9c3ff32b1?q=80&w=800",
        latitude: 30.6570,
        longitude: 104.0665,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "region_5",
        name: "浙江省",
        description: "中国东部沿海省份，经济发达，风景秀丽",
        image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=800",
        latitude: 30.2741,
        longitude: 120.1551,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "region_6",
        name: "云南省",
        description: "中国西南边陲，自然风光绮丽，民族文化多样",
        image: "https://images.unsplash.com/photo-1501509497947-782e9020af51?q=80&w=800",
        latitude: 25.0453,
        longitude: 102.7097,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
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

