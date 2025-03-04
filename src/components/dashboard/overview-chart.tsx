"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Jan", revenue: 4000, profit: 2400, orders: 240 },
  { name: "Feb", revenue: 3000, profit: 1398, orders: 210 },
  { name: "Mar", revenue: 2000, profit: 9800, orders: 290 },
  { name: "Apr", revenue: 2780, profit: 3908, orders: 200 },
  { name: "May", revenue: 1890, profit: 4800, orders: 181 },
  { name: "Jun", revenue: 2390, profit: 3800, orders: 250 },
  { name: "Jul", revenue: 3490, profit: 4300, orders: 210 },
  { name: "Aug", revenue: 4000, profit: 2400, orders: 240 },
  { name: "Sep", revenue: 3000, profit: 1398, orders: 210 },
  { name: "Oct", revenue: 2000, profit: 9800, orders: 290 },
  { name: "Nov", revenue: 2780, profit: 3908, orders: 200 },
  { name: "Dec", revenue: 3490, profit: 4300, orders: 210 },
];

export function OverviewChart() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            View your store performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue">
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="profit">Profit</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1) / 0.2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="profit" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2) / 0.2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="orders" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}