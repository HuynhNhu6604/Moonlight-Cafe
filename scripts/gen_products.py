import json
import random

# Seed for reproducibility if needed
random.seed(42)

# Templates for procedural generation
templates = {
    "coffee": {
        "names": [
            "Cà phê {base} {adj}", "{base} {flavor}", "Moonlight {base} Đặc Biệt", 
            "{base} Sương Sớm", "Cà phê {base} Hoàng Gia", "Signature {base}"
        ],
        "bases": ["Đen Đá", "Sữa Đá", "Bạc Xỉu", "Espresso", "Americano", "Cappuccino", "Latte", "Mocha", "Cold Brew", "Macchiato", "Flat White", "Trứng", "Cốt Dừa", "Muối"],
        "adj": ["Đậm Đà", "Truyền Thống", "Hiện Đại", "Thượng Hạng", "Nguyên Bản", "Rang Mộc"],
        "flavor": ["Caramel", "Hạnh Nhân", "Hương Vani", "Sô Cô La Đen", "Hương Mộc", "Kem Phô Mai"],
        "desc_bases": [
            "Khởi đầu ngày mới với {name}. Hương vị {adj_desc} từ những hạt {bean} tuyển chọn khắt khe nhất.",
            "Trải nghiệm chuẩn mực mới của cà phê. {name} mang đến sự kết hợp hoàn hảo giữa {bean} và bí quyết pha chế độc quyền.",
            "Thưởng thức {name} - một bản giao hưởng hương vị tuyệt vời. Vị {taste} lưu luyến mãi nơi đầu lưỡi.",
            "Từng giọt {name} là sự chắt lọc tinh túy. Thanh tao, êm dịu và {adj_desc} đến bất ngờ."
        ],
        "beans": ["Arabica Cầu Đất nguyên chất", "Robusta Đắk Lắk thượng hạng", "cà phê phối trộn độc quyền", "hạt cà phê rang mộc chuẩn Ý"],
        "tastes": ["đắng dịu, ngọt hậu", "béo ngậy của sữa hòa quyện vị đắng nhẹ", "mộc mạc, đậm chất", "thanh tao, chua nhẹ đặc trưng"],
        "adj_descs": ["đậm đà khó quên", "thơm lừng lan tỏa", "nồng nàn quyến rũ", "tinh tế"]
    },
    "tea": {
        "names": [
            "Trà {base} {flavor}", "{base} {adj}", "Moonlight {base} Điền Trang", 
            "Trà {base} Nhiệt Đới", "{base} Thượng Cát", "Trà {base} Cung Đình"
        ],
        "bases": ["Oolong", "Đen", "Xanh", "Sen", "Bạch Trà", "Lài", "Dâu", "Đào", "Vải", "Cúc", "Earl Grey", "Matcha"],
        "adj": ["Hoa Quả", "Thanh Mát", "Hoàng Kim", "Thượng Dược", "Tươi", "Kem Cheese"],
        "flavor": ["Cam Đào", "Hạt Sen", "Sả Tắc", "Mật Ong", "Trân Châu Nghệ Nhân", "Kem Béo"],
        "desc_bases": [
            "Thanh lọc cơ thể và tâm hồn với {name}. Vị trà {adj_desc} được ủ từ những lá {leaf} hái tay lúc bình minh.",
            "{name} mang theo hơi thở của thiên nhiên. Sự hòa quyện bùng nổ giữa {taste} tạo nên thức uống giải nhiệt hoàn hảo.",
            "Dành cho những tâm hồn tinh tế, {name} tỏa ra hương thơm nồng nàn của {leaf}, đọng lại vị {taste}.",
            "Thư giãn tuyệt đối với một ly {name}. Công thức độc quyền mang đến trải nghiệm {adj_desc} vượt ngoài mong đợi."
        ],
        "leaves": ["trà cổ thụ nguyên sương", "búp trà non tươi tắn", "hồng trà nhập khẩu cao cấp", "lục trà Thái Nguyên sấy lạnh"],
        "tastes": ["chát nhẹ, ngọt sâu", "thơm ngát hoa trái tươi", "thanh tao thư thái", "ngọt ngào khó cưỡng"],
        "adj_descs": ["thanh mát mượt mà", "ngát hương hoa", "tươi mới rạng rỡ", "êm ái"]
    },
    "smoothie": {
        "names": [
            "Sinh tố {base} {flavor}", "Nước ép {base} {adj}", "{base} Nhiệt Đới Mix", 
            "Moonlight {base} Detox", "Cực Phẩm {base} Xay", "Healthy {base}"
        ],
        "bases": ["Bơ", "Xoài", "Dâu Tây", "Mãng Cầu", "Cà Chốt", "Lựu", "Táo", "Cam", "Dưa Hấu", "Chanh Dây", "Kiwi", "Chuối"],
        "adj": ["Detox", "Tươi Mát", "Sữa Chua", "Nguyên Chất", "Mát Lạnh", "Tự Nhiên"],
        "flavor": ["Mix Dừa non", "Hạt Chia", "Dầm Yến Mạch", "Hạnh Nhân", "Mật Ong", "Cốt Dừa"],
        "desc_bases": [
            "Bổ sung vitamin dồi dào với {name}. Trái cây {adj_desc} kết hợp cùng {special} cho hương vị bùng nổ.",
            "Đầy ắp năng lượng tự nhiên trong ly {name}. Vị {taste} sẽ chinh phục cả những vị khách khó tính nhất.",
            "Thức uống {adj_desc} mang tên {name}. Giải pháp healthy 100% không đường tinh luyện, tôn vinh vị {taste}.",
            "Giải nhiệt ngày hè cùng {name}. Mỗi ngụm đều cảm nhận được sự sảng khoái từ trái cây tươi được thu hoạch mỗi ngày."
        ],
        "specials": ["sữa tươi không đường", "sữa chua Hy Lạp", "hạt dinh dưỡng cao cấp", "đá tuyết bào xốp mịn"],
        "tastes": ["chua ngọt tự nhiên", "béo thơm thanh mát", "ngọt dịu mọng nước", "đậm đà hương trái cây nhiệt đới"],
        "adj_descs": ["tươi tuyển chọn 100%", "organic thượng hạng", "chín mọng nguyên chất", "thanh lành"]
    },
    "pastry": {
        "names": [
            "Bánh {base} {flavor}", "{base} {adj}", "Moonlight {base}", 
            "{base} Kiểu {style}", "{style} {base} Đặc Mệnh", "{base} Nghệ Nhân"
        ],
        "bases": ["Tiramisu", "Croissant", "Macaron", "Cheesecake", "Mousse", "Tart", "Mochi", "Bông Lan", "Bánh Dứa", "Panna Cotta", "Cookie", "Éclair", "Phô Mai Nướng"],
        "adj": ["Tan Chảy", "Ngàn Lớp", "Cốt Dừa", "Trứng Muối", "Thượng Hạng", "Cổ Điển"],
        "flavor": ["Trà Xanh", "Sô Cô La Bỉ", "Dâu Tây Cà Lạt", "Chanh Vàng", "Vani Madagascar", "Trái Cây Rừng"],
        "style": ["Pháp", "Nhật Bản", "Ý", "Đài Loan", "Châu Âu", "Á Đông"],
        "desc_bases": [
            "Tinh hoa nghệ thuật làm bánh phương {style} hội tụ trong {name}. Vỏ bánh {texture}, nhân mịn màng khó cưỡng.",
            "{name} - Nét quyến rũ từ tráng miệng kiểu {style}. Sự giao thoa tinh tế giữa {taste} tạo nên kiệt tác ẩm thực.",
            "Chạm vào vị giác với hương vị {name}. Cắn một miếng cảm nhận ngay độ {texture} và vị {taste}.",
            "Bản tình ca ngọt ngào mang tên {name}. Nguyên liệu chuẩn {style} mang đến trải nghiệm {texture} tan chảy trọn vẹn."
        ],
        "textures": ["mềm xốp êm ái", "giòn rụm bên ngoài dai bên trong", "mịn như nhung", "bồng bềnh như mây"],
        "tastes": ["ngọt thanh không gắt", "béo ngậy phô mai", "đậm vị matcha nguyên bản", "ngào ngạt bơ Pháp thượng hạng"],
        "adj_descs": ["tinh xảo nghệ nhân", "hoàn mỹ", "gây nghiện", "thanh tao"]
    },
    "snack": {
        "names": [
            "Snack {base} {adj}", "{base} {flavor}", "Moonlight {base}", 
            "{base} Khô", "{base} Lắc {flavor}", "Túi {base} Nhâm Nhi"
        ],
        "bases": ["Khoai Tây Trứng Muối", "Mix Hạt Dinh Dưỡng", "Trái Cây Sấy", "Bánh Quy Bơ", "Bò Khô", "Rong Biển", "Đậu Phộng", "Granola", "Khô Gà", "Biscotti", "Bánh Mì Sấy"],
        "adj": ["Giòn Rụm", "Cay Nồng", "Ngũ Cốc", "Hữu Cơ", "Thơm Phức", "Thủ Công"],
        "flavor": ["Phô Mai Lắc", "Muối Tiêu", "Mật Ong Cay", "Bơ Tỏi", "Truely Sả Chanh", "Matcha"],
        "desc_bases": [
            "Món ăn vặt lý tưởng lúc buồn miệng: {name}. Từng miếng {adj_desc} mang theo vị {taste} hấp dẫn.",
            "Nhâm nhi trọn vẹn hương vị thủ công cùng {name}. Vị {taste} được tẩm ướp kỹ lưỡng sẽ khiến bạn không thể ngừng tay.",
            "Ăn ngon không sợ béo với {name}. Sản phẩm chế biến sạch, {adj_desc} cực đã, nổi bật hương {taste}.",
            "Thêm phần rôm rả cho buổi trò chuyện cùng {name}. Giòn, thơm, {adj_desc} - đích thị là {taste} số một."
        ],
        "tastes": ["mặn ngọt đậm đà", "giòn tan bắt vị", "cay tê đầu lưỡi", "ngọt thanh chua nhẹ dẻo ngọt"],
        "adj_descs": ["giòn rôm rốp", "sấy thăng hoa giữ nguyên chất", "hương vị tẩm ướp độc quyền", "thơm lừng"]
    }
}

# Pricing ranges based on categories
price_ranges = {
    "coffee": (25000, 65000),
    "tea": (30000, 55000),
    "smoothie": (35000, 75000),
    "pastry": (25000, 85000),
    "snack": (20000, 60000)
}

def generate_product(cat_id, count):
    products = []
    generated_names = set()
    cat = templates[cat_id]
    
    for _ in range(count):
        # Ensure unique names
        name = ""
        attempts = 0
        while attempts < 10:
            name_tpl = random.choice(cat["names"])
            name = name_tpl.format(
                base=random.choice(cat["bases"]),
                adj=random.choice(cat["adj"]),
                flavor=random.choice(cat["flavor"]),
                style=cat.get("style", [""])[random.randint(0, len(cat.get("style", [""]))-1)] if "style" in cat else ""
            )
            name = " ".join(name.split())
            if name not in generated_names:
                generated_names.add(name)
                break
            attempts += 1
            
        desc_tpl = random.choice(cat["desc_bases"])
        
        args = {
            "name": name,
            "adj_desc": random.choice(cat["adj_descs"]),
            "taste": random.choice(cat["tastes"])
        }
        
        if "beans" in cat: args["bean"] = random.choice(cat["beans"])
        if "leaves" in cat: args["leaf"] = random.choice(cat["leaves"])
        if "specials" in cat: args["special"] = random.choice(cat["specials"])
        if "textures" in cat: args["texture"] = random.choice(cat["textures"])
        if "style" in cat: args["style"] = random.choice(cat["style"])
            
        desc = desc_tpl.format(**args)
        
        price = random.randint(price_ranges[cat_id][0]//1000, price_ranges[cat_id][1]//1000) * 1000
        
        product = {
            "name": name,
            "category": cat_id,
            "price": price,
            "description": desc,
            "imageUrl": "",
            "isAvailable": True,
            "createdAt": "2024-03-01T08:00:00.000Z" # Dummy timestamp format
        }
        
        products.append(product)
        
    return products

if __name__ == "__main__":
    final_products = []
    # 30 for each as requested
    categories_keys = ["coffee", "tea", "smoothie", "pastry", "snack"]
    for c in categories_keys:
        cats_items = generate_product(c, 30)
        final_products.extend(cats_items)
        
    with open("bulk_products.json", "w", encoding="utf-8") as f:
        json.dump(final_products, f, ensure_ascii=False, indent=4)
        
    print(f"Generated {len(final_products)} products successfully!")
