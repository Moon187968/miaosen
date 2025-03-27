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
      },
      {
        id: "product_2",
        name: "上海蟹粉小笼包",
        region_id: "region_2", // 上海市
        description: "上海蟹粉小笼包是上海传统名点，以鲜肉和蟹粉为馅料，皮薄馅多，汤汁丰富，风味独特。",
        origin: "上海市",
        shipping_from: "上海市黄浦区",
        specifications: [
          {name: "规格", value: "12个/盒"},
          {name: "保质期", value: "冷冻30天"}
        ],
        notes: ["速冻保存", "蒸制后食用"],
        images: ["https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800"],
        ktt_link: "https://ktt.pinduoduo.com/groups/detail/example2",
        contact_info: "联系电话: 021-87654321",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "product_3",
        name: "广东凤凰单丛茶",
        region_id: "region_3", // 广东省
        description: "凤凰单丛茶是广东省潮州市特产名茶，属于乌龙茶类，具有'色绿、香郁、味甘、形美'的特点，香气独特，有天然花香。",
        origin: "广东省潮州市",
        shipping_from: "广东省潮州市凤凰镇",
        specifications: [
          {name: "规格", value: "250g/罐"},
          {name: "等级", value: "特级"}
        ],
        notes: ["密封保存", "避免阳光直射"],
        images: ["https://images.unsplash.com/photo-1546877625-cb8c71916e6b?q=80&w=800"],
        ktt_link: "https://ktt.pinduoduo.com/groups/detail/example3",
        contact_info: "联系电话: 0768-12345678",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "product_4",
        name: "四川麻辣火锅底料",
        region_id: "region_4", // 四川省
        description: "四川麻辣火锅底料是四川传统火锅的灵魂，选用数十种香料和辣椒精制而成，麻辣鲜香，回味悠长。",
        origin: "四川省成都市",
        shipping_from: "四川省成都市",
        specifications: [
          {name: "规格", value: "500g/袋"},
          {name: "保质期", value: "12个月"}
        ],
        notes: ["开封后冷藏保存", "可按个人口味调整用量"],
        images: ["https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800"],
        ktt_link: "https://ktt.pinduoduo.com/groups/detail/example4",
        contact_info: "联系电话: 028-87654321",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "product_5",
        name: "浙江西湖龙井茶",
        region_id: "region_5", // 浙江省
        description: "西湖龙井茶是中国十大名茶之一，产于浙江省杭州市西湖龙井村周围群山，具有'色绿、香郁、味甘、形美'四绝。",
        origin: "浙江省杭州市",
        shipping_from: "浙江省杭州市西湖区",
        specifications: [
          {name: "规格", value: "100g/罐"},
          {name: "等级", value: "明前特级"}
        ],
        notes: ["密封避光保存", "85℃水温冲泡"],
        images: ["https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?q=80&w=800"],
        ktt_link: "https://ktt.pinduoduo.com/groups/detail/example5",
        contact_info: "联系电话: 0571-12345678",
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

