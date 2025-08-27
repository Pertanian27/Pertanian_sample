import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function App() {
  const [form, setForm] = useState({
    tanggal: "",
    kecamatan: "",
    kelompok: "",
    alamat: "",
    padiReguler: "",
    padiPompa: "",
    padiGogo: "",
    jagung: "",
    kedelai: "",
  });
  const [rekap, setRekap] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRekap([...rekap, form]);
    setForm({
      tanggal: "",
      kecamatan: "",
      kelompok: "",
      alamat: "",
      padiReguler: "",
      padiPompa: "",
      padiGogo: "",
      jagung: "",
      kedelai: "",
    });
  };

  // Hitung total luas tanam per komoditi (kabupaten)
  const totalKabupaten = rekap.reduce(
    (acc, row) => {
      acc.padiReguler += Number(row.padiReguler || 0);
      acc.padiPompa += Number(row.padiPompa || 0);
      acc.padiGogo += Number(row.padiGogo || 0);
      acc.jagung += Number(row.jagung || 0);
      acc.kedelai += Number(row.kedelai || 0);
      return acc;
    },
    { padiReguler: 0, padiPompa: 0, padiGogo: 0, jagung: 0, kedelai: 0 }
  );

  // Hitung total per kecamatan sesuai komoditi
  const totalPerKecamatan = rekap.reduce((acc, row) => {
    if (!acc[row.kecamatan]) {
      acc[row.kecamatan] = { padiReguler: 0, padiPompa: 0, padiGogo: 0, jagung: 0, kedelai: 0 };
    }
    acc[row.kecamatan].padiReguler += Number(row.padiReguler || 0);
    acc[row.kecamatan].padiPompa += Number(row.padiPompa || 0);
    acc[row.kecamatan].padiGogo += Number(row.padiGogo || 0);
    acc[row.kecamatan].jagung += Number(row.jagung || 0);
    acc[row.kecamatan].kedelai += Number(row.kedelai || 0);
    return acc;
  }, {});

  // Hitung total per kelompok tani
  const totalPerKelompok = rekap.reduce((acc, row) => {
    if (!acc[row.kelompok]) {
      acc[row.kelompok] = { padiReguler: 0, padiPompa: 0, padiGogo: 0, jagung: 0, kedelai: 0 };
    }
    acc[row.kelompok].padiReguler += Number(row.padiReguler || 0);
    acc[row.kelompok].padiPompa += Number(row.padiPompa || 0);
    acc[row.kelompok].padiGogo += Number(row.padiGogo || 0);
    acc[row.kelompok].jagung += Number(row.jagung || 0);
    acc[row.kelompok].kedelai += Number(row.kedelai || 0);
    return acc;
  }, {});

  // Data untuk grafik per kecamatan
  const chartData = Object.entries(totalPerKecamatan).map(([kec, vals]) => ({
    kecamatan: kec,
    ...vals,
  }));

  // Data untuk pie chart total komoditi
  const pieData = [
    { name: "Padi Reguler", value: totalKabupaten.padiReguler },
    { name: "Padi Pompa", value: totalKabupaten.padiPompa },
    { name: "Padi Gogo", value: totalKabupaten.padiGogo },
    { name: "Jagung", value: totalKabupaten.jagung },
    { name: "Kedelai", value: totalKabupaten.kedelai },
  ];

  const COLORS = ["#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534"];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Halaman Utama */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          Dinas Pertanian dan Pangan Kabupaten Jembrana
        </h1>
        <p className="text-lg text-green-600">Bidang Pertanian</p>
      </header>

      {/* Form Input Data */}
      <Card className="max-w-3xl mx-auto mb-10">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Form Penginputan Data Harian
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} required />

            <Select name="kecamatan" onValueChange={(val) => setForm({ ...form, kecamatan: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Melaya">Melaya</SelectItem>
                <SelectItem value="Negara">Negara</SelectItem>
                <SelectItem value="Jembrana">Jembrana</SelectItem>
                <SelectItem value="Mendoyo">Mendoyo</SelectItem>
                <SelectItem value="Pekutatan">Pekutatan</SelectItem>
              </SelectContent>
            </Select>

            <Input type="text" placeholder="Kelompok Tani/Subak" name="kelompok" value={form.kelompok} onChange={handleChange} required />
            <Input type="text" placeholder="Alamat" name="alamat" value={form.alamat} onChange={handleChange} required />

            <Input type="number" placeholder="Padi Reguler (Ha)" name="padiReguler" value={form.padiReguler} onChange={handleChange} />
            <Input type="number" placeholder="Padi Pompa (Ha)" name="padiPompa" value={form.padiPompa} onChange={handleChange} />
            <Input type="number" placeholder="Padi Gogo (Ha)" name="padiGogo" value={form.padiGogo} onChange={handleChange} />
            <Input type="number" placeholder="Jagung (Ha)" name="jagung" value={form.jagung} onChange={handleChange} />
            <Input type="number" placeholder="Kedelai (Ha)" name="kedelai" value={form.kedelai} onChange={handleChange} />

            <Button type="submit" className="col-span-2 bg-green-600 hover:bg-green-700">
              Simpan Data
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Rekap Data */}
      <Card className="max-w-6xl mx-auto mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Rekap Data Harian
          </h2>
          <table className="w-full border text-sm mb-4">
            <thead className="bg-green-200">
              <tr>
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Kecamatan</th>
                <th className="border p-2">Kelompok Tani/Subak</th>
                <th className="border p-2">Alamat</th>
                <th className="border p-2">Padi Reguler</th>
                <th className="border p-2">Padi Pompa</th>
                <th className="border p-2">Padi Gogo</th>
                <th className="border p-2">Jagung</th>
                <th className="border p-2">Kedelai</th>
              </tr>
            </thead>
            <tbody>
              {rekap.map((row, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{row.tanggal}</td>
                  <td className="border p-2">{row.kecamatan}</td>
                  <td className="border p-2">{row.kelompok}</td>
                  <td className="border p-2">{row.alamat}</td>
                  <td className="border p-2">{row.padiReguler}</td>
                  <td className="border p-2">{row.padiPompa}</td>
                  <td className="border p-2">{row.padiGogo}</td>
                  <td className="border p-2">{row.jagung}</td>
                  <td className="border p-2">{row.kedelai}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Kabupaten */}
          <div className="bg-green-100 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-green-700 mb-2">Total Kabupaten (Ha)</h3>
            <ul className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              <li>Padi Reguler: <strong>{totalKabupaten.padiReguler}</strong></li>
              <li>Padi Pompa: <strong>{totalKabupaten.padiPompa}</strong></li>
              <li>Padi Gogo: <strong>{totalKabupaten.padiGogo}</strong></li>
              <li>Jagung: <strong>{totalKabupaten.jagung}</strong></li>
              <li>Kedelai: <strong>{totalKabupaten.kedelai}</strong></li>
            </ul>
          </div>

          {/* Total per Kecamatan */}
          <div className="bg-green-100 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-green-700 mb-2">Total Per Kecamatan (Ha)</h3>
            <table className="w-full border text-sm">
              <thead className="bg-green-200">
                <tr>
                  <th className="border p-2">Kecamatan</th>
                  <th className="border p-2">Padi Reguler</th>
                  <th className="border p-2">Padi Pompa</th>
                  <th className="border p-2">Padi Gogo</th>
                  <th className="border p-2">Jagung</th>
                  <th className="border p-2">Kedelai</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totalPerKecamatan).map(([kec, vals]) => (
                  <tr key={kec} className="text-center">
                    <td className="border p-2 font-semibold">{kec}</td>
                    <td className="border p-2">{vals.padiReguler}</td>
                    <td className="border p-2">{vals.padiPompa}</td>
                    <td className="border p-2">{vals.padiGogo}</td>
                    <td className="border p-2">{vals.jagung}</td>
                    <td className="border p-2">{vals.kedelai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total per Kelompok Tani/Subak */}
          <div className="bg-green-100 p-4 rounded-md">
            <h3 className="font-semibold text-green-700 mb-2">Total Per Kelompok Tani/Subak (Ha)</h3>
            <table className="w-full border text-sm">
              <thead className="bg-green-200">
                <tr>
                  <th className="border p-2">Kelompok Tani/Subak</th>
                  <th className="border p-2">Padi Reguler</th>
                  <th className="border p-2">Padi Pompa</th>
                  <th className="border p-2">Padi Gogo</th>
                  <th className="border p-2">Jagung</th>
                  <th className="border p-2">Kedelai</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totalPerKelompok).map(([kel, vals]) => (
                  <tr key={kel} className="text-center">
                    <td className="border p-2 font-semibold">{kel}</td>
                    <td className="border p-2">{vals.padiReguler}</td>
                    <td className="border p-2">{vals.padiPompa}</td>
                    <td className="border p-2">{vals.padiGogo}</td>
                    <td className="border p-2">{vals.jagung}</td>
                    <td className="border p-2">{vals.kedelai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grafik Visual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="h-80 bg-white p-4 rounded-lg shadow">
              <h3 className="text-green-700 font-semibold mb-2">Total Luas Tanam per Kecamatan</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="kecamatan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="padiReguler" fill="#4ade80" name="Padi Reguler" />
                  <Bar dataKey="padiPompa" fill="#22c55e" name="Padi Pompa" />
                  <Bar dataKey="padiGogo" fill="#16a34a" name="Padi Gogo" />
                  <Bar dataKey="jagung" fill="#15803d" name="Jagung" />
                  <Bar dataKey="kedelai" fill="#166534" name="Kedelai" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-80 bg-white p-4 rounded-lg shadow">
              <h3 className="text-green-700 font-semibold mb-2">Distribusi Komoditi (Kabupaten)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
