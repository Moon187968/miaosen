import { NextRequest, NextResponse } from 'next/server';
import { createProduct, updateProduct, deleteProduct, getAllProducts } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // 返回静态的产品数据，不依赖数据库
    const products = [
      {
        id: "product_1",
        name: "北京烤鸭",
        region_id: "region_1", // 北京市
        description: "北京烤鸭是具有世界声誉的北京著名菜式，起源于中国南北朝时期，至今已有1500多年历史。用特殊方法烤制的全鸭，色泽红艳，肉质细嫩，味道醇厚。",
        origin: "北京市",
        shipping_from: "北京市朝阳区",
        specifications: [
          {name: "规格", value: "整只装"},
          {name: "重量", value: "约2kg"}
        ],
        notes: ["需冷藏保存", "建议加热后食用"],
        images: ["https://images.unsplash.com/photo-1582452737434-0f14ddfc166d?q=80&w=800"],
        ktt_link: "https://ktt.pinduoduo.com/groups/detail/example1",
        contact_info: "联系电话: 010-12345678",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('获取产品数据失败:', error);
    return NextResponse.json({ error: '获取产品数据失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const env = request.env as any;
    
    // 验证必填字段
    if (!data.name || !data.region_id || !data.origin) {
      return NextResponse.json({ error: '产品名称、所属地区和产地为必填项' }, { status: 400 });
    }
    
    // 创建产品
    const productId = await createProduct(env.DB, data);
    
    return NextResponse.json({ id: productId, success: true });
  } catch (error) {
    console.error('创建产品失败:', error);
    return NextResponse.json({ error: '创建产品失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: '缺少产品ID' }, { status: 400 });
    }
    
    const data = await request.json();
    const env = request.env as any;
    
    // 更新产品
    const success = await updateProduct(env.DB, id, data);
    
    if (!success) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新产品失败:', error);
    return NextResponse.json({ error: '更新产品失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: '缺少产品ID' }, { status: 400 });
    }
    
    const env = request.env as any;
    
    // 删除产品
    const success = await deleteProduct(env.DB, id);
    
    if (!success) {
      return NextResponse.json({ error: '产品不存在或删除失败' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除产品失败:', error);
    return NextResponse.json({ error: '删除产品失败' }, { status: 500 });
  }
}
