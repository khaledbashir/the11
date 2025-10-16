// Utility functions for SOW operations

// Helper: Format investment amount to rounded thousands (e.g., $24,875 -> $25k)
export function formatInvestment(amount: number): string {
  if (!amount) return '$0';
  
  // Round to nearest thousand
  const rounded = Math.round(amount / 1000);
  
  // Format with k suffix
  return `$${rounded}k`;
}

// Helper: Calculate total investment from pricing tables in content
export function calculateTotalInvestment(content: any): number {
  try {
    if (!content || !content.content) return 0;
    
    let total = 0;
    const traverse = (node: any) => {
      if (node.type === 'editablePricingTable' && node.attrs?.rows) {
        const subtotal = node.attrs.rows.reduce((sum: number, row: any) => {
          const hours = parseFloat(row.hours) || 0;
          const rate = parseFloat(row.rate) || 0;
          return sum + (hours * rate);
        }, 0);
        total += subtotal;
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };
    traverse(content);
    return total;
  } catch (error) {
    console.error('Error calculating total investment:', error);
    return 0;
  }
}
