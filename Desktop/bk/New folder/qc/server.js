
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./view");
app.listen(3000);
var pg = require('pg');
var config = {
  user: 'postgres',
  database: 'khuyenmai',
  password: 'nguoidung99',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMIllis: 3000,
};
var pool = new pg.Pool(config);
var giatien;

//----------------------hiển thị list khuyến mãi--------------------------------
app.get("/admin/listkm", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM promotion ORDER BY id ASC', function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.render("dskm.ejs", {danhsach:result});
    });
  });
});

//----------------------thêm khuyến mãi-----------------------------------------
app.get("/admin/themkm", function(req, res){
  res.render("themkm.ejs");
});
app.post("/admin/themkm", urlencodedParser, function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    };
    var idsp = req.body.txt_idsp;
    var poster = req.body.txt_poster;
    var linknd = req.body.txt_linknd;
    var gia = req.body.txt_gia;
    var ngaykt = req.body.txt_ngaykt;
    client.query(" INSERT INTO promotion(idsp, poster, link_nd, gia, ngaykt) VALUES('"+idsp+"', '"+poster+"', '"+linknd+"', '"+gia+"', '"+ngaykt+"');" , function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      };
    });

    client.query(" SELECT * FROM shop WHERE id = '"+idsp+"';" , function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      else{
    var a = result.rows[0].gia_moi_san_pham;
    client.query(" UPDATE promotion SET giatruoc = '"+a+"'WHERE idsp='"+idsp+"'; ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      };
    });
    client.query(" UPDATE shop SET gia_moi_san_pham = '"+gia+"' WHERE id= '"+idsp+"';", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      };

    });
  };
});

  res.redirect("../admin/listkm");
  });
});
//----------------------sửa list khuyến mãi-------------------------------------
app.get("/admin/sua/:id", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var id = req.params.id;
    client.query("SELECT * FROM promotion WHERE id ='"+id+"'", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.render("sua.ejs", {sv:result.rows[0]});
    });
  });
});
app.post("/admin/sua", urlencodedParser, function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var  id = req.body.txt_id;
    var poster = req.body.txt_poster;
    var linknd = req.body.txt_linknd;
    var ngaykt = req.body.txt_ngaykt;
    client.query("UPDATE promotion SET poster ='"+poster+"', link_nd ='"+linknd+"', ngaykt ='"+ngaykt+"' WHERE id='"+id+"'  ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
          res.redirect("../admin/listkm");
    });
  });
});

//----------------------xóa khuyến mãi------------------------------------------
app.get("/admin/xoa/:id", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var  id = req.params.id;
    client.query(" SELECT * FROM promotion WHERE id = '"+id+"' " , function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      var  a=result.rows[0].giatruoc;
      var  b=result.rows[0].idsp;
      client.query("UPDATE shop SET  gia_moi_san_pham ='"+a+"'WHERE id ='"+b+"' ", function(err, result){
        done();
        if(err){
          res.end();
          return console.error('error runing query', err);
        }
      });
    });

    client.query("DELETE FROM promotion WHERE id='"+id+"'  ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.redirect("../../admin/listkm");
    });
  });
})
//----------------------trang chủ------------------------------------------
app.get("/", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM shop ORDER BY id ASC', function(err, result){
      done();

      if(err){
        res.end();
        return console.error('error runing query', err);
      }
    //  console.log(result.rows[0].idsp);
      res.render("main.ejs", {danhsach:result});
    });
  });
});

//-----------------------list quảng cáo-----------------------------------------
app.get("/admin/listqc", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM quangcao ORDER BY id ASC', function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.render("dsqc.ejs", {danhsach:result});
    });
  });
});

//---------------------thêm quảng cáo-------------------------------------------
app.get("/admin/themqc", function(req, res){
  res.render("themqc.ejs");
});
app.post("/admin/themqc", urlencodedParser, function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var img = req.body.txt_img;
    var link = req.body.txt_link;
    var a = req.body.txt_gia;
    client.query(" INSERT INTO quangcao(img, link) VALUES('"+img+"', '"+link+"')" , function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.redirect("../../admin/themqc");
    });
  });
});

//-----------------sửa quảng cáo------------------------------------------------
app.get("/admin/suaqc/:id", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var id = req.params.id;
    client.query("SELECT * FROM quangcao WHERE id ='"+id+"'", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.render("suaqc.ejs", {sv:result.rows[0]});
    });
  });
});
app.post("/admin/suaqc", urlencodedParser, function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var  id = req.body.txt_id;
    var img = req.body.txt_img;
    var link = req.body.txt_link;
    client.query("UPDATE quangcao SET img ='"+img+"', link ='"+link+"' WHERE id='"+id+"'  ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
          res.redirect("../admin/listqc");
    });
  });
});

//-----------------------xóa quảng cáo------------------------------------------
app.get("/admin/xoaqc/:id", function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    var  id = req.params.id;

    client.query("DELETE FROM quangcao WHERE id='"+id+"'  ", function(err, result){
      done();
      if(err){
        res.end();
        return console.error('error runing query', err);
      }
      res.redirect("../../admin/listqc");
    });
  });
});
