const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mysql=require('mysql');
const cors=require("cors")
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'blood_db'
})
console.log("connected");

app.post('/reg_donor',(req,res)=>{
    console.log("reg-donor");
    console.log(req.body);
    var bg=req.body.d_blood_grp;
    if(req.body.Rh_grp=='POSITIVE'){
        bg+='+';
    }   
    else{
        bg+='-';
    }
    connection.query(`SELECT * from donor WHERE d_mail='${req.body.d_mail}'`,(err,rows,fileds)=>{
        var date=new Date();
        var year = date.toLocaleString("default", { year: "numeric" });
        var month = date.toLocaleString("default", { month: "2-digit" });
        var day = date.toLocaleString("default", { day: "2-digit" });
        console.log(rows);
        var formattedDate = year + "-" + month + "-" + day;
        if(err) throw err;
        if(rows.length==0){        
            var query=`INSERT INTO donor(d_name,d_blood_group,d_mail,d_dob,d_age,date_of_last_donation,no_of_donations,d_gender,date_of_donation) values('${req.body.d_name}','${bg}','${req.body.d_mail}','${req.body.d_dob}',${req.body.d_age},'${req.body.date_of_last_donation}',${req.body.no_of_donations},'${req.body.gender}','${formattedDate}')`;
            console.log(query);    
            connection.query(query,(err,status)=>{
                if(err){
                    throw err;
                    res.json(err);
                }
                else{
                    connection.query(`SELECT d_id FROM donor WHERE d_mail='${req.body.d_mail}'`,(err,rowsx,fields)=>{
                        console.log(rowsx);
                        if(req.body.Rh_grp=='POSITIVE'){     

                            connection.query(`INSERT INTO blood(d_id,date_of_collection,Rh,volume,blood_group) values(${rowsx[0].d_id},'${formattedDate}','+',250.00,'${req.body.d_blood_grp}')`,(err,status)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("+");
                                    console.log(status);
                                }
                            });
                        }
                        else{
                            connection.query(`INSERT INTO blood(d_id,date_of_collection,Rh,volume,blood_group) values(${rowsx[0].d_id},'${formattedDate}','-',250.00,'${req.body.d_blood_grp})'`,(err,status)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("-");
                                    console.log(status);
                                }
                            });
                        }
                    });
                }
                res.json({status});
            });
        }
        else{
            //second time
                connection.query(`UPDATE donor set date_of_donation='${formattedDate}' WHERE d_mail='${req.body.d_mail}'`,(err,rows,fields)=>{
                    console.log(rows);
                    connection.query(`SELECT d_id FROM donor WHERE d_mail='${req.body.d_mail}'`,(err,rowsx,fields)=>{
                        console.log(rowsx);
                        if(req.body.Rh_grp=='POSITIVE'){     

                            connection.query(`INSERT INTO blood(d_id,date_of_collection,Rh,volume,blood_group) values(${rowsx[0].d_id},'${formattedDate}','+',250.00,'${req.body.d_blood_grp}')`,(err,status)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("+");
                                    console.log(status);
                                }
                            });
                        }
                        else{
                            connection.query(`INSERT INTO blood(d_id,date_of_collection,Rh,volume,blood_group) values(${rowsx[0].d_id},'${formattedDate}','-',250.00,'${req.body.d_blood_grp})'`,(err,status)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("-");
                                    console.log(status);
                                }
                            });
                        }
                    });
                });
        }
    });
    
});

app.post("/reg_patient",(req,res)=>{
    console.log(req.body);

    res.json(req.body);

    return 

    connection.query(`INSERT INTO patient(p_name ,p_blood_grp , p_mail ,no_of_transactions ,p_dob date,p_age ,height , weight  ,p_gender) 
    values('${req.body.p_name}','${req.body.p_blood_grp}','${req.body.p_mail}',${req.body.no_of_donations}, '${req.body.p_dob}',${req.body.p_age},${req.body.p_height},${req.body.p_weight},'${req.body.gender}');`,(err,status)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(status);
            connection.query('SELECT * from patient',(err,rows,fields)=>{
                if(err) throw err;
            })
        }
    });
    connection.query(`SELECT * from blood where blood_group='${req.p_blood_grp}'`,(err,rows,fields)=>{
        if(rows.length==0){
            res.json(false);
        }
        else{
            connection.query(`DELETE from blood where blood_group='${req.body.p_blood_grp}'`,(err,status)=>{
                if(err) throw err;
                else{
                    console.log(status);
                }
            })
            res.json(true);
        }
    })
});
app.listen(4000,()=>{
    console.log("Server up and running at http://localhost:4000"); 
});
